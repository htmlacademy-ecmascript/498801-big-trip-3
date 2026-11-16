import { render, replace, remove } from '../framework/render';
import PointItemView from '../view/point-item-view';
import EditFormView from '../view/edit-form-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #tripModel = null;
  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({ pointsListContainer, tripModel, handleDataChange, handleModeChange }) {
    this.#pointsListContainer = pointsListContainer;
    this.#tripModel = tripModel;
    this.#handleDataChange = handleDataChange;
    this.#handleModeChange = handleModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointItemView({
      point,
      offers: this.#tripModel.getOffersById(point.type, point.offers),
      destination: this.#tripModel.getDestinationById(point.destination),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point,
      destination: this.#tripModel.getDestinationById(point.destination),
      destinationsAll: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      offersType: this.#tripModel.getOffersByType(point.type),
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleFormSubmit,
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  // Вызываем из events-presenter.js
  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    this.#handleModeChange();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => this.#replacePointToForm();
  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    this.#handleDataChange(this.#point);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}
