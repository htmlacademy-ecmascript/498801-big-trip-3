import { humanizeDueDate, capitalize } from '../utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const EDIT_FORM_CLASS_NAME = 'event--edit';
const ROLLUP_BUTTON_CLASS_NAME = 'event__rollup-btn';
const RESET_BUTTON_CLASS_NAME = 'event__reset-btn';
const TYPE_FIELDSET_CLASS_NAME = 'event__type-group';
const DESTINATION_INPUT_CLASS_NAME = 'event__input--destination';
const PRICE_INPUT_CLASS_NAME = 'event__input--price';
const AVAILABLE_OFFERS_CLASS_NAME = 'event__available-offers';
const INPUTS_TIME_CLASS_NAME = 'event__input--time';

const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
};

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);

const formatDate = (date) => (date ? humanizeDueDate(date, 'DD/MM/YY HH:mm') : '');

const getResetButtonText = (id, isDeleting) => {
  if (!id) {
    return 'Cancel';
  }
  return isDeleting ? 'Deleting...' : 'Delete';
};

const createEventTypeTemplate = (type, offers, formId, disabled) =>
  /* HTML */
  `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${formId}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon" />
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${formId}" type="checkbox" ${disabled} />

      <div class="event__type-list">
        <fieldset class="event__type-group" ${disabled}>
          <legend class="visually-hidden">Event type</legend>

          ${offers.map((offer) => `<div class="event__type-item">
            <input id="event-type-${offer.type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${offer.type === type ? 'checked' : ''} />
            <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}">
              ${capitalize(offer.type)}
            </label>
          </div>`).join('')}

        </fieldset>
      </div>
    </div>`;

const createRollupButtonTemplate = (disabled) =>
  /* HTML */
  `<button class="event__rollup-btn" type="button" ${disabled}>
    <span class="visually-hidden">Open event</span>
  </button>`;

const createOffersTemplate = (offersType, pointOffers, disabled) => {
  if (!offersType?.offers?.length) {
    return '';
  }

  const selectedIds = pointOffers.map(String);

  return /*HTML*/ `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersType.offers
    .map(
      ({ title, price, id }) =>
      /* HTML */ `<div class="event__offer-selector">
                <input class="event__offer-checkbox visually-hidden" data-offer-id="${id}" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${selectedIds.includes(String(id)) ? 'checked' : ''} ${disabled} />
                <label class="event__offer-label" for="event-offer-luggage-${id}">
                  <span class="event__offer-title">${escapeHtml(title)}</span>
                  &plus;&euro;
                  <span class="event__offer-price">${price}</span>
                </label>
              </div>`,
    )
    .join('')}
      </div>
    </section>`;
};

const createPicturesTemplate = (pictures) => {
  if (pictures.length === 0) {
    return '';
  }

  return /*HTML*/ `
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${escapeHtml(picture.src)}" alt="${escapeHtml(picture.description)}" />`).join('')}
        </div>
      </div>
    `;
};

const createDestinationTemplate = (destination) => {
  if (!destination?.description) {
    return '';
  }

  const { description, pictures = [] } = destination;

  return /*HTML*/ `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${escapeHtml(description)}</p>
      ${createPicturesTemplate(pictures)}
    </section>
    `;
};

const createDetailsTemplate = (offersType, pointOffers, destination, disabled) => {
  const offersTemplate = createOffersTemplate(offersType, pointOffers, disabled);
  const destinationTemplate = createDestinationTemplate(destination);

  if (!offersTemplate && !destinationTemplate) {
    return '';
  }

  return /*HTML*/ `
    <section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`;
};

const createEditFormViewTemplate = (point, destinationsAll, offers) => {
  const {
    id, type, dateFrom, dateTo, basePrice,
    destinationFromId: destination, offersType,
    isDisabled, isSaving, isDeleting,
  } = point;

  const formId = id ?? 'new';
  const disabled = isDisabled ? 'disabled' : '';
  const rollupButton = id ? createRollupButtonTemplate(disabled) : '';
  const resetButtonText = getResetButtonText(id, isDeleting);
  const saveButtonText = isSaving ? 'Saving...' : 'Save';
  const destinationName = destination ? destination.name : '';

  /* HTML */
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeTemplate(type, offers, formId, disabled)}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${formId}"> ${type} </label>
          <input class="event__input  event__input--destination" id="event-destination-${formId}" type="text" name="event-destination" value="${escapeHtml(destinationName)}" list="destination-list-${formId}" autocomplete="off" required ${disabled} />
          <datalist id="destination-list-${formId}">
            ${destinationsAll.map((item) => `<option value="${escapeHtml(item.name)}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom)}" required ${disabled} />
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo)}" required ${disabled} />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${escapeHtml(basePrice)}" pattern="^[1-9][0-9]*$" required ${disabled} />
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${disabled}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset" ${disabled}>${resetButtonText}</button>
        ${rollupButton}
      </header>
      ${createDetailsTemplate(offersType, point.offers, destination, disabled)}
    </form>
  </li>`;
};

export default class EditFormView extends AbstractStatefulView {
  #destinationsAll = null;
  #offers = null;
  #onFormSubmit = null;
  #onCloseClick = null;
  #onDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, destination, destinationsAll, offers, offersType, onFormSubmit, onCloseClick, onDeleteClick }) {
    super();
    this._setState(EditFormView.parsePointToState(point, destination, offersType));
    this.#destinationsAll = destinationsAll;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseClick = onCloseClick;
    this.#onDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
  }

  #destroyDatepickers() {
    this.#datepickerFrom?.destroy();
    this.#datepickerTo?.destroy();
    this.#datepickerFrom = null;
    this.#datepickerTo = null;
  }

  #setDatepickers() {
    const inputTimeElements = this.element.querySelectorAll(`.${INPUTS_TIME_CLASS_NAME}`);
    const [startInputElement, endInputElement] = inputTimeElements;

    const DATEPICKER_CONFIG = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    this.#datepickerFrom = flatpickr(startInputElement, {
      ...DATEPICKER_CONFIG,
      defaultDate: this._state.dateFrom,
      maxDate: this._state.dateTo,
      onChange: this.#dateFromChangeHandler,
    });

    this.#datepickerTo = flatpickr(endInputElement, {
      ...DATEPICKER_CONFIG,
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onChange: this.#dateToChangeHandler,
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }

    this._setState({ dateFrom: userDate.toISOString() });
    this.#datepickerTo.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }

    this._setState({ dateTo: userDate.toISOString() });
    this.#datepickerFrom.set('maxDate', userDate);
  };

  reset(point, destination, offersType) {
    this.updateElement(EditFormView.parsePointToState(point, destination, offersType));
  }

  _restoreHandlers() {
    const editFormElement = this.element.querySelector(`.${EDIT_FORM_CLASS_NAME}`);
    const formCloseElement = this.element.querySelector(`.${ROLLUP_BUTTON_CLASS_NAME}`);
    const resetButtonElement = this.element.querySelector(`.${RESET_BUTTON_CLASS_NAME}`);
    const typeFieldsetElement = this.element.querySelector(`.${TYPE_FIELDSET_CLASS_NAME}`);
    const destinationInputElement = this.element.querySelector(`.${DESTINATION_INPUT_CLASS_NAME}`);
    const priceInputElement = this.element.querySelector(`.${PRICE_INPUT_CLASS_NAME}`);
    const availableOffersElement = this.element.querySelector(`.${AVAILABLE_OFFERS_CLASS_NAME}`);

    editFormElement.addEventListener('submit', this.#formSubmitHandler);
    formCloseElement?.addEventListener('click', this.#formCloseHandler);
    resetButtonElement.addEventListener('click', this.#formDeleteClickHandler);
    typeFieldsetElement.addEventListener('change', this.#typeChangeHandler);
    destinationInputElement.addEventListener('change', this.#destinationChangeHandler);
    priceInputElement.addEventListener('input', this.#priceChangeHandler);
    availableOffersElement?.addEventListener('change', this.#offerChangeHandler);

    this.#setDatepickers();
  }

  #isStateValid() {
    const { destinationFromId, dateFrom, dateTo, basePrice } = this._state;
    const price = Number(basePrice);

    return Boolean(destinationFromId)
      && Boolean(dateFrom)
      && Boolean(dateTo)
      && Number.isInteger(price)
      && price > 0;
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this.#isStateValid()) {
      return;
    }

    this.#onFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  #typeChangeHandler = (evt) => {
    const targetType = evt.target.value;
    const typeOffers = this.#offers.find((item) => item.type === targetType);

    this.updateElement({
      type: targetType,
      offersType: typeOffers ?? null,
      offers: [],
    });
  };

  #offerChangeHandler = () => {
    const checkedIds = [...this.element.querySelectorAll('.event__offer-checkbox:checked')]
      .map((element) => element.dataset.offerId);

    const checkedOffers = this._state.offersType.offers
      .filter((offer) => checkedIds.includes(String(offer.id)))
      .map((offer) => offer.id);

    this._setState({
      offers: checkedOffers,
    });
  };

  #destinationChangeHandler = (evt) => {
    const targetDestination = evt.target.value;
    const foundDestination = this.#destinationsAll.find((item) => item.name === targetDestination);

    if (!foundDestination) {
      evt.target.value = this._state.destinationFromId?.name ?? '';
      return;
    }

    this.updateElement({
      destination: foundDestination.id,
      destinationFromId: foundDestination,
    });
  };

  #priceChangeHandler = (evt) => {
    const value = evt.target.value.replace(/\D/g, '');

    evt.target.value = value;
    this._setState({
      basePrice: value,
    });
  };

  static parsePointToState(point, destination, offersType) {
    return {
      ...point,
      destinationFromId: destination,
      offersType,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state, basePrice: Number(state.basePrice) };
    delete point.destinationFromId;
    delete point.offersType;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  get template() {
    return createEditFormViewTemplate(
      this._state,
      this.#destinationsAll,
      this.#offers,
    );
  }
}
