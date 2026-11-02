import { tripPoints } from '../mock/trip-points';
import { tripDestinations } from '../mock/trip-destinations';
import { tripOffers } from '../mock/trip-offers';

export default class tripModel {
  #points = tripPoints;
  #destinations = tripDestinations;
  #offers = tripOffers;

  get points() {
    return structuredClone(this.#points);
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
