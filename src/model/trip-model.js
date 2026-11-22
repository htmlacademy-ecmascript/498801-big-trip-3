import Observable from '../framework/observable.js';
import { tripPoints } from '../mock/trip-points';
import { tripDestinations } from '../mock/trip-destinations';
import { tripOffers } from '../mock/trip-offers';

export default class TripModel extends Observable {
  #points = tripPoints;
  #destinations = tripDestinations;
  #offers = tripOffers;

  get points() {
    return structuredClone(this.#points);
  }

  setPoints(points) {
    this.#points = points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    const newPoint = { ...update, id: crypto.randomUUID() };
    this.#points = [newPoint, ...this.#points];
    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType);
  }

  get destinations() {
    return structuredClone(this.#destinations);
  }

  get offers() {
    return structuredClone(this.#offers);
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
