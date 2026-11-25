import { render, replace, remove } from '../framework/render';
import PointItemView from '../view/point-item-view';
import EditFormView from '../view/edit-form-view';
import { UserAction, UpdateType, ESCAPE_KEY } from '../consts';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #tripModel = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #mode = Mode.DEFAULT;
  #isRequestPending = false;

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

    this.#pointComponent = this.#createPointComponent();

    if (prevPointComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    // Точка перерисовалась, пока была открыта форма: форму пересоздаём с новыми данными,
    // а новая карточка уже ждёт в #pointComponent
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent = this.#createEditFormComponent();
      replace(this.#editFormComponent, prevEditFormComponent);
      remove(prevEditFormComponent);
    }

    remove(prevPointComponent);
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

    // звёздочка: форма закрыта, трясём саму точку
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
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
  }

  #createEditFormComponent() {
    return new EditFormView({
      point: this.#point,
      destination: this.#tripModel.getDestinationById(this.#point.destination),
      destinationsAll: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      offersType: this.#tripModel.getOffersByType(this.#point.type),
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick,
      onDeleteClick: this.#handleDeleteClick,
    });
  }

  #replacePointToForm() {
    this.#handleModeChange();
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

  #handleEditClick = () => this.#replacePointToForm();

  #handleCloseClick = () => {
    if (this.#isRequestPending) {
      return;
    }

    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };
}
