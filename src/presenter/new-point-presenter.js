import { render, remove, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { UserAction, UpdateType } from '../consts.js';

const createBlankPoint = () => ({
  type: 'flight',
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
  #handleDataChange = null;
  #handleDestroy = null;
  #formComponent = null;

  constructor({ container, tripModel, handleDataChange, handleDestroy }) {
    this.#container = container;
    this.#tripModel = tripModel;
    this.#handleDataChange = handleDataChange;
    this.#handleDestroy = handleDestroy;
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
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick,
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
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDestroy();
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
