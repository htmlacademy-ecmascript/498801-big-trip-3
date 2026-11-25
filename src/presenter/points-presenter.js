import { render, remove, RenderPosition } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import MessageView from '../view/message-view.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorLoadingView from '../view/error-loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { TextNoEvent, SortType, UserAction, UpdateType, FilterType } from '../consts.js';
import { filter, sortByDay, sortByTime, sortByPrice } from '../utils.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PointsPresenter {
  #eventsContainer = null;
  #tripModel = null;
  #filterModel = null;

  #eventsListComponent = new PointsListView();
  #messageComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();
  #errorLoadingComponent = new ErrorLoadingView();

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #isCreating = false;
  #isLoading = true;
  #isErrorLoading = false;

  #newPointPresenter = null;
  #handleNewPointClose = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ eventsContainer, tripModel, filterModel, handleNewPointClose }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#tripModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#handleNewPointClose = handleNewPointClose;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventsListComponent.element,
      tripModel,
      handleDataChange: this.#handleViewAction,
      handleDestroy: this.#handleNewPointDestroy,
    });
  }

  createPoint() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#handleModeChange();
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleNewPointDestroy = () => {
    this.#isCreating = false;
    this.#handleNewPointClose();
    if (this.points.length === 0) {
      this.#renderMessage();
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  get points() {
    const filteredPoints = filter[this.#filterModel.filter](this.#tripModel.points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints.sort(sortByDay);
  }

  init() {
    this.#renderBoard();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id)?.setSaving();
        try {
          await this.#tripModel.updatePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id)?.setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#tripModel.addPoint(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id)?.setDeleting();
        try {
          await this.#tripModel.deletePoint(updateType, update);
        } catch {
          this.#pointPresenters.get(update.id)?.setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#isErrorLoading = true;
        this.#renderBoard();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderErrorLoading() {
    render(this.#errorLoadingComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      handleSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderMessage() {
    this.#messageComponent = new MessageView(TextNoEvent[this.#filterModel.filter]);
    render(this.#messageComponent, this.#eventsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#eventsListComponent.element,
      tripModel: this.#tripModel,
      handleDataChange: this.#handleViewAction,
      handleModeChange: this.#handleModeChange,
    });

    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #renderBoard() {
    const points = this.points;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isErrorLoading) {
      this.#renderErrorLoading();
      return;
    }

    if (points.length === 0 && !this.#isCreating) {
      this.#renderMessage();
      return;
    }

    if (points.length > 0) {
      this.#renderSort();
    }
    render(this.#eventsListComponent, this.#eventsContainer);
    points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#messageComponent);

    this.#sortComponent = null;
    this.#messageComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
