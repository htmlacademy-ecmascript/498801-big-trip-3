import Observable from '../framework/observable.js';
import { adaptToClient } from '../server/adapter-service.js';
import { UpdateType } from '../consts.js';

export default class TripModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
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
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      this._notify(UpdateType.ERROR);
      return;
    }

    this._notify(UpdateType.INIT);
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

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = adaptToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch {
      throw new Error('Can\'t delete point');
    }
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
}
