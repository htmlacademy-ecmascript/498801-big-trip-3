import { render } from '../framework/render';
import EventsListView from '../view/events-list-view';
import MessageView from '../view/message-view';
import FilterView from '../view/filter-view';
import { generateFilters } from '../mock/filter-mock.js';
import { TextNoEvent } from '../consts';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';

const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

export default class TripEventsPresenter {
  #eventsContainer = null;
  #tripModel = null;
  #eventsListComponent = new EventsListView();
  #eventsListElement = this.#eventsListComponent.element;
  #messageComponent = null;
  #filterComponent = null;
  #points = [];
  #pointPresenters = new Map();

  constructor({ eventsContainer, tripModel }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint (point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#eventsListElement,
      tripModel: this.#tripModel,
      handleDataChange: this.#handlePointChange,
      handleModeChange: this.#handleModeChange,
    });

    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #clearPoints () {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
  }


  #renderTripBoard () {
    const filters = generateFilters(this.#points);
    this.#messageComponent = new MessageView(TextNoEvent.EVERYTHING);
    this.#filterComponent = new FilterView({ filters });

    render(this.#filterComponent, filtersElement);

    if(this.#points.length === 0) {
      render(this.#messageComponent, eventsElement);
      return;
    }

    render(this.#eventsListComponent, this.#eventsContainer);
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  init() {
    this.#points = this.#tripModel.points;
    this.#renderTripBoard();
  }
}
