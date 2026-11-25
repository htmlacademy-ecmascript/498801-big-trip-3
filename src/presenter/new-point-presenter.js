import { render, remove, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType, DEFAULT_POINT_TYPE, ESCAPE_KEY } from '../consts.js';

const createBlankPoint = () => ({
  type: DEFAULT_POINT_TYPE,
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: [],
  isFavorite: false,
});

export default class NewPointPresenter {
  #container = null;
  #tripModel = null;
  #onDataChange = null;
  #onDestroy = null;
  #formComponent = null;
  #isRequestPending = false;

  constructor({ container, tripModel, onDataChange, onDestroy }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#formComponent !== null) {
      return;
    }

    const point = createBlankPoint();

    this.#formComponent = new EditFormView({
      point,
      destination: null,
      destinationsAll: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      offersType: this.#tripModel.getOffersByType(point.type),
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#cancelClickHandler,
    });

    render(this.#formComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#formComponent === null) {
      return;
    }

    remove(this.#formComponent);
    this.#formComponent = null;
    this.#isRequestPending = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#onDestroy();
  }

  setSaving() {
    if (this.#formComponent === null) {
      return;
    }

    this.#isRequestPending = true;
    this.#formComponent.updateElement({ isDisabled: true, isSaving: true });
  }

  setAborting() {
    this.#isRequestPending = false;

    if (this.#formComponent === null) {
      return;
    }

    this.#formComponent.updateElement({ isDisabled: false, isSaving: false });
    this.#formComponent.shake();
  }

  #formSubmitHandler = (point) => {
    if (this.#isRequestPending) {
      return;
    }

    this.#onDataChange(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #cancelClickHandler = () => {
    if (this.#isRequestPending) {
      return;
    }

    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (this.#isRequestPending) {
      return;
    }

    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
