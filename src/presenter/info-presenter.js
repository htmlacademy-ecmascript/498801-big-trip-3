import { render, replace, remove, RenderPosition } from '../framework/render.js';
import InfoView from '../view/info-view.js';
import { sortByDay, getRouteCities, getTripDates } from '../utils.js';

export default class InfoPresenter {
  #container = null;
  #tripModel = null;

  #infoComponent = null;

  constructor({ container, tripModel }) {
    this.#container = container;
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#modelEventHandler);
  }

  init() {
    const points = this.#tripModel.points.sort(sortByDay);
    const previousInfoComponent = this.#infoComponent;

    if (points.length === 0) {
      remove(previousInfoComponent);
      this.#infoComponent = null;
      return;
    }

    const cityNames = points
      .map((point) => this.#tripModel.getDestinationById(point.destination)?.name)
      .filter(Boolean);

    this.#infoComponent = new InfoView({
      cities: getRouteCities(cityNames),
      dates: getTripDates(points[0].dateFrom, points[points.length - 1].dateTo),
      cost: this.#getTotalCost(points),
    });

    if (previousInfoComponent === null) {
      render(this.#infoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoComponent, previousInfoComponent);
    remove(previousInfoComponent);
  }

  #getTotalCost(points) {
    return points.reduce((total, point) => {
      const offersPrice = this.#tripModel
        .getOffersById(point.type, point.offers)
        .reduce((sum, offer) => sum + offer.price, 0);

      return total + point.basePrice + offersPrice;
    }, 0);
  }

  #modelEventHandler = () => {
    this.init();
  };
}
