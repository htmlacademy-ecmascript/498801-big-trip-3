import { render, remove, RenderPosition } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import MessageView from '../view/message-view.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorLoadingView from '../view/error-loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { TextNoEvent, SortType, UserAction, UpdateType, FilterType } from '../consts.js';
import { filter, sortByDay, sortByTime, sortByPrice } from '../utils.js';

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
  #onNewPointClose = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ eventsContainer, tripModel, filterModel, onNewPointClose }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;

    this.#tripModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);

    this.#onNewPointClose = onNewPointClose;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventsListComponent.element,
      tripModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler,
    });
  }

  get points() {
    const filteredPoints = filter[this.#filterModel.filter](this.#tripModel.points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        return filteredPoints.sort(sortByDay);
    }
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#modeChangeHandler();
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderErrorLoading() {
    render(this.#errorLoadingComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler,
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
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler,
    });

    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isErrorLoading) {
      this.#renderErrorLoading();
      return;
    }

    const points = this.points;

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

  #rerenderBoard(options) {
    this.#clearBoard(options);
    this.#renderBoard();
  }

  #finishLoading() {
    this.#isLoading = false;
    remove(this.#loadingComponent);
  }

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    this.#onNewPointClose();

    if (this.points.length === 0) {
      this.#renderMessage();
    }
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    const presenter = actionType === UserAction.ADD_POINT
      ? this.#newPointPresenter
      : this.#pointPresenters.get(update.id);

    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          presenter?.setSaving();
          await this.#tripModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          presenter.setSaving();
          await this.#tripModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          presenter?.setDeleting();
          await this.#tripModel.deletePoint(updateType, update);
          break;
      }
    } catch {
      presenter?.setAborting();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#rerenderBoard();
        break;
      case UpdateType.MAJOR:
        this.#rerenderBoard({ resetSortType: true });
        break;
      case UpdateType.INIT:
        this.#finishLoading();
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#finishLoading();
        this.#isErrorLoading = true;
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#rerenderBoard();
  };
}
