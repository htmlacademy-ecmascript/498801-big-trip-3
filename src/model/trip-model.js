import Observable from '../framework/observable.js';
import { adaptToClient } from '../server/adapter-service.js';
import { UpdateType, ErrorMessage } from '../consts.js';

export default class TripModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return structuredClone(this.#points);
  }

  get destinations() {
    return structuredClone(this.#destinations);
  }

  get offers() {
    return structuredClone(this.#offers);
  }

  async init() {
    try {
      const [points, offers, destinations] = await Promise.all([
        this.#pointsApiService.points,
        this.#pointsApiService.offers,
        this.#pointsApiService.destinations,
      ]);

      this.#points = points.map(adaptToClient);
      this.#offers = offers;
      this.#destinations = destinations;
    } catch {
      this._notify(UpdateType.ERROR);
      return;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    if (!this.#hasPoint(update.id)) {
      throw new Error(ErrorMessage.UPDATE_UNEXISTING_POINT);
    }

    let updatedPoint = null;

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      updatedPoint = adaptToClient(response);
    } catch {
      throw new Error(ErrorMessage.UPDATE_POINT);
    }

    this.#points = this.#points.map((point) => (point.id === updatedPoint.id ? updatedPoint : point));
    this._notify(updateType, updatedPoint);
  }

  async addPoint(updateType, update) {
    let newPoint = null;

    try {
      const response = await this.#pointsApiService.addPoint(update);
      newPoint = adaptToClient(response);
    } catch {
      throw new Error(ErrorMessage.ADD_POINT);
    }

    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);
  }

  async deletePoint(updateType, update) {
    if (!this.#hasPoint(update.id)) {
      throw new Error(ErrorMessage.DELETE_UNEXISTING_POINT);
    }

    try {
      await this.#pointsApiService.deletePoint(update);
    } catch {
      throw new Error(ErrorMessage.DELETE_POINT);
    }

    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    return offersType ? offersType.offers.filter((item) => itemsId.includes(item.id)) : [];
  }

  getDestinationById(id) {
    return this.#destinations.find((item) => item.id === id);
  }

  #hasPoint(id) {
    return this.#points.some((point) => point.id === id);
  }
}
