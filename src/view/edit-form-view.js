import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDueDate, capitalize, escapeHtml } from '../utils.js';
import { DateFormat } from '../consts.js';

const EDIT_FORM_CLASS_NAME = 'event--edit';
const ROLLUP_BUTTON_CLASS_NAME = 'event__rollup-btn';
const RESET_BUTTON_CLASS_NAME = 'event__reset-btn';
const TYPE_FIELDSET_CLASS_NAME = 'event__type-group';
const DESTINATION_INPUT_CLASS_NAME = 'event__input--destination';
const PRICE_INPUT_CLASS_NAME = 'event__input--price';
const AVAILABLE_OFFERS_CLASS_NAME = 'event__available-offers';
const INPUTS_TIME_CLASS_NAME = 'event__input--time';
const OFFER_CHECKBOX_CHECKED_SELECTOR = '.event__offer-checkbox:checked';

const NEW_POINT_FORM_ID = 'new';

const ButtonText = {
  SAVE: 'Save',
  SAVING: 'Saving...',
  DELETE: 'Delete',
  DELETING: 'Deleting...',
  CANCEL: 'Cancel',
};

const DATEPICKER_CONFIG = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
};

const getResetButtonText = (id, isDeleting) => {
  if (!id) {
    return ButtonText.CANCEL;
  }

  return isDeleting ? ButtonText.DELETING : ButtonText.DELETE;
};

const createEventTypeTemplate = (type, offerGroups, formId, disabled) =>
  /* HTML */
  `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${escapeHtml(formId)}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${escapeHtml(type)}.png" alt="Event type icon" />
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${escapeHtml(formId)}" type="checkbox" ${disabled} />

      <div class="event__type-list">
        <fieldset class="event__type-group" ${disabled}>
          <legend class="visually-hidden">Event type</legend>

          ${offerGroups.map((group) => `<div class="event__type-item">
            <input id="event-type-${escapeHtml(group.type)}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${escapeHtml(group.type)}" ${group.type === type ? 'checked' : ''} />
            <label class="event__type-label  event__type-label--${escapeHtml(group.type)}" for="event-type-${escapeHtml(group.type)}">
              ${escapeHtml(capitalize(group.type))}
            </label>
          </div>`).join('')}

        </fieldset>
      </div>
    </div>`;

const createDestinationFieldTemplate = ({ type, destinationName, destinationsAll, formId, disabled }) =>
  /* HTML */
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${escapeHtml(formId)}"> ${escapeHtml(capitalize(type))} </label>
    <input class="event__input  event__input--destination" id="event-destination-${escapeHtml(formId)}" type="text" name="event-destination" value="${escapeHtml(destinationName)}" list="destination-list-${escapeHtml(formId)}" autocomplete="off" required ${disabled} />
    <datalist id="destination-list-${escapeHtml(formId)}">
      ${destinationsAll.map((item) => `<option value="${escapeHtml(item.name)}"></option>`).join('')}
    </datalist>
  </div>`;

const createTimeFieldTemplate = (dateFrom, dateTo, disabled) =>
  /* HTML */
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDueDate(dateFrom, DateFormat.FORM)}" required ${disabled} />
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDueDate(dateTo, DateFormat.FORM)}" required ${disabled} />
  </div>`;

const createPriceFieldTemplate = (basePrice, disabled) =>
  /* HTML */
  `<div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${escapeHtml(basePrice)}" pattern="^[1-9][0-9]*$" required ${disabled} />
  </div>`;

const createRollupButtonTemplate = (disabled) =>
  /* HTML */
  `<button class="event__rollup-btn" type="button" ${disabled}>
    <span class="visually-hidden">Open event</span>
  </button>`;

const createControlsTemplate = ({ id, isSaving, isDeleting, disabled }) => {
  const saveButtonText = isSaving ? ButtonText.SAVING : ButtonText.SAVE;
  const resetButtonText = getResetButtonText(id, isDeleting);
  const rollupButton = id ? createRollupButtonTemplate(disabled) : '';

  return /* HTML */ `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${disabled}>${saveButtonText}</button>
    <button class="event__reset-btn" type="reset" ${disabled}>${resetButtonText}</button>
    ${rollupButton}`;
};

const createOffersTemplate = (offersType, pointOffers, disabled) => {
  if (!offersType?.offers?.length) {
    return '';
  }

  return /* HTML */ `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersType.offers
    .map(
      ({ title, price, id }) =>
      /* HTML */ `<div class="event__offer-selector">
                <input class="event__offer-checkbox visually-hidden" data-offer-id="${escapeHtml(id)}" id="event-offer-luggage-${escapeHtml(id)}" type="checkbox" name="event-offer-luggage" ${pointOffers.includes(id) ? 'checked' : ''} ${disabled} />
                <label class="event__offer-label" for="event-offer-luggage-${escapeHtml(id)}">
                  <span class="event__offer-title">${escapeHtml(title)}</span>
                  &plus;&euro;
                  <span class="event__offer-price">${escapeHtml(price)}</span>
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

  return /* HTML */ `
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${escapeHtml(picture.src)}" alt="${escapeHtml(picture.description)}" />`).join('')}
        </div>
      </div>
    `;
};

const createDestinationTemplate = (destination) => {
  const description = destination?.description ?? '';
  const pictures = destination?.pictures ?? [];

  if (!description && pictures.length === 0) {
    return '';
  }

  return /* HTML */ `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${description ? `<p class="event__destination-description">${escapeHtml(description)}</p>` : ''}
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

  return /* HTML */ `
    <section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`;
};

const createEditFormViewTemplate = (point, destinationsAll, offerGroups) => {
  const {
    id, type, dateFrom, dateTo, basePrice,
    destinationFromId: destination, offersType,
    isDisabled, isSaving, isDeleting,
  } = point;

  const formId = id ?? NEW_POINT_FORM_ID;
  const disabled = isDisabled ? 'disabled' : '';
  const destinationName = destination ? destination.name : '';

  return /* HTML */ `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeTemplate(type, offerGroups, formId, disabled)}
        ${createDestinationFieldTemplate({ type, destinationName, destinationsAll, formId, disabled })}
        ${createTimeFieldTemplate(dateFrom, dateTo, disabled)}
        ${createPriceFieldTemplate(basePrice, disabled)}
        ${createControlsTemplate({ id, isSaving, isDeleting, disabled })}
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

  get template() {
    return createEditFormViewTemplate(
      this._state,
      this.#destinationsAll,
      this.#offers,
    );
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
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

  #destroyDatepickers() {
    this.#datepickerFrom?.destroy();
    this.#datepickerTo?.destroy();
    this.#datepickerFrom = null;
    this.#datepickerTo = null;
  }

  #setDatepickers() {
    const inputTimeElements = this.element.querySelectorAll(`.${INPUTS_TIME_CLASS_NAME}`);
    const [startInputElement, endInputElement] = inputTimeElements;

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

  #isStateValid() {
    const { destinationFromId, dateFrom, dateTo, basePrice } = this._state;
    const price = Number(basePrice);

    return Boolean(destinationFromId)
      && Boolean(dateFrom)
      && Boolean(dateTo)
      && !dayjs(dateTo).isBefore(dateFrom)
      && Number.isInteger(price)
      && price > 0;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this.#isStateValid()) {
      return;
    }

    this.#onFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #formCloseHandler = () => {
    this.#onCloseClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditFormView.parseStateToPoint(this._state));
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
    const checkedIds = [...this.element.querySelectorAll(OFFER_CHECKBOX_CHECKED_SELECTOR)]
      .map((element) => element.dataset.offerId);

    this._setState({ offers: checkedIds });
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
    this._setState({ basePrice: value });
  };

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
}
