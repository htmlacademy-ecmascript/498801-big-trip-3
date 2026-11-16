import { render } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import MessageView from '../view/message-view.js';
import FilterView from '../view/filter-view.js';
import { generateFilters } from '../mock/filter-mock.js';
import { TextNoEvent, SortType } from '../consts.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sortByDay, sortByTime, sortByPrice } from '../utils.js';
import SortView from '../view/sort-view.js';

const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

export default class PointsPresenter {
  #eventsContainer = null;
  #tripModel = null;
  #eventsListComponent = new PointsListView();
  #eventsListElement = this.#eventsListComponent.element;
  #messageComponent = null;
  #filterComponent = null;
  #sortComponent = null;
  #points = [];
  #pointPresenters = new Map();
  #sourcedPoints = [];
  #currentSortType = SortType.DAY;

  constructor({ eventsContainer, tripModel }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      case SortType.DAY:
        this.#points.sort(sortByDay);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderPointList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      handleSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventsContainer);
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
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

  #renderPointList() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderTripBoard () {
    const filters = generateFilters(this.#points);
    this.#messageComponent = new MessageView(TextNoEvent.EVERYTHING);
    this.#filterComponent = new FilterView({ filters });

    this.#renderSort();

    render(this.#filterComponent, filtersElement);

    if(this.#points.length === 0) {
      render(this.#messageComponent, eventsElement);
      return;
    }

    render(this.#eventsListComponent, this.#eventsContainer);
    this.#renderPointList();
  }

  init() {
    this.#points = [...this.#tripModel.points];
    this.#sourcedPoints = [...this.#tripModel.points];
    this.#sortPoints(this.#currentSortType);
    this.#renderTripBoard();
  }
}
