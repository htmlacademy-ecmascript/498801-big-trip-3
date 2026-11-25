import { render, replace, remove } from '../framework/render.js';
import PointItemView from '../view/point-item-view.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType, ESCAPE_KEY } from '../consts.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainer = null;
  #tripModel = null;
  #onDataChange = null;
  #onModeChange = null;

  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #mode = Mode.DEFAULT;
  #isRequestPending = false;

  constructor({ pointsListContainer, tripModel, onDataChange, onModeChange }) {
    this.#pointsListContainer = pointsListContainer;
    this.#tripModel = tripModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const previousPointComponent = this.#pointComponent;
    const previousEditFormComponent = this.#editFormComponent;

    this.#pointComponent = this.#createPointComponent();

    if (previousPointComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, previousPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent = this.#createEditFormComponent();
      replace(this.#editFormComponent, previousEditFormComponent);
      remove(previousEditFormComponent);
    }

    remove(previousPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#isRequestPending = true;
      this.#editFormComponent.updateElement({ isDisabled: true, isSaving: true });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#isRequestPending = true;
      this.#editFormComponent.updateElement({ isDisabled: true, isDeleting: true });
    }
  }

  setAborting() {
    this.#isRequestPending = false;

    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    this.#editFormComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
    this.#editFormComponent.shake();
  }

  #createPointComponent() {
    return new PointItemView({
      point: this.#point,
      offers: this.#tripModel.getOffersById(this.#point.type, this.#point.offers),
      destination: this.#tripModel.getDestinationById(this.#point.destination),
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });
  }

  #createEditFormComponent() {
    return new EditFormView({
      point: this.#point,
      destination: this.#tripModel.getDestinationById(this.#point.destination),
      destinationsAll: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      offersType: this.#tripModel.getOffersByType(this.#point.type),
      onFormSubmit: this.#formSubmitHandler,
      onCloseClick: this.#closeClickHandler,
      onDeleteClick: this.#deleteClickHandler,
    });
  }

  #replacePointToForm() {
    this.#onModeChange();
    this.#editFormComponent = this.#createEditFormComponent();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    remove(this.#editFormComponent); // вместе с формой уничтожаются и календари
    this.#editFormComponent = null;
    this.#isRequestPending = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (this.#isRequestPending) {
      return;
    }

    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #editClickHandler = () => {
    this.#replacePointToForm();
  };

  #closeClickHandler = () => {
    if (this.#isRequestPending) {
      return;
    }

    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (point) => {
    if (this.#isRequestPending) {
      return;
    }

    this.#onDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
  };

  #deleteClickHandler = (point) => {
    if (this.#isRequestPending) {
      return;
    }

    this.#onDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #favoriteClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };
}
