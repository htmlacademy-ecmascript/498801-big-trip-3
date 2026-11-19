import { humanizeDueDate } from '../utils';
import { capitalize } from '../helpers';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const EDIT_FORM_CLASS_NAME = 'event--edit';
const ROLLUP_BUTTON_CLASS_NAME = 'event__rollup-btn';
const TYPE_FIELDSET_CLASS_NAME = 'event__type-group';
const DESTINATION_INPUT_CLASS_NAME = 'event__input--destination';
const PRICE_INPUT_CLASS_NAME = 'event__input--price';
const AVAILABLE_OFFERS_CLASS_NAME = 'event__available-offers';
const INPUTS_TIME_CLASS_NAME = 'event__input--time';

const createEventTypeTemplate = (type, offers, id) =>
  /* HTML */
  `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon" />
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" />

      <div class="event__type-list">
        <fieldset class="event__type-group">
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
const createRollupButtonTemplate = () =>
  /* HTML */
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

const createOffersTemplate = (offersType, pointOffers) => {
  if (offersType.offers.length !== 0) {
    return /*HTML*/ `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersType.offers
    .map(
      ({ title, price, id }) =>
      /* HTML */ `<div class="event__offer-selector">
                <input class="event__offer-checkbox visually-hidden" data-offer-id="${id}" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${pointOffers.includes(id) ? 'checked' : ''} />
                <label class="event__offer-label" for="event-offer-luggage-${id}">
                  <span class="event__offer-title">${title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${price}</span>
                </label>
              </div>`,
    )
    .join('')}
      </div>
    </section>`;
  }
  return '';
};

const createPicturesTemplate = (pictures) => {
  if (pictures.length > 0) {
    return /*HTML*/ `
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}" />`).join('')}
        </div>
      </div>
    `;
  }
  return '';
};

const createDestinationTemplate = ({ description, pictures }) => {
  if (description) {
    return /*HTML*/ `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${createPicturesTemplate(pictures)}
    </section>
    `;
  }
  return '';
};

const createEditFormViewTemplate = (point, destinationsAll, offers) => {
  const { id, type, dateFrom, dateTo, basePrice, destinationFromId: destination, offersType} = point;

  const rollupButton = id ? createRollupButtonTemplate() : '';
  const cancelButtonText = id ? 'Delete' : 'Cancel';
  /* HTML */
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeTemplate(type, offers, id)}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}"> ${type} </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}" />
          <datalist id="destination-list-${id}">
            ${destinationsAll.map((item) => `<option value="${item.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDueDate(dateFrom, 'DD/MM/YY HH:mm')}" />
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDueDate(dateTo, 'DD/MM/YY HH:mm')}" />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" />
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${cancelButtonText}</button>
        ${rollupButton}
      </header>
      <section class="event__details">
        ${createOffersTemplate(offersType, point.offers)}
        ${createDestinationTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class EditFormView extends AbstractStatefulView {
  #destinationsAll = null;
  #offers = null;
  #onFormSubmit = null;
  #onCloseClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, destination, destinationsAll, offers, offersType, onFormSubmit, onCloseClick }) {
    super();
    this._setState(EditFormView.parsePointToState(point, destination, offersType));
    this.#destinationsAll = destinationsAll;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseClick = onCloseClick;
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

  _restoreHandlers () {
    const editFormElement = this.element.querySelector(`.${EDIT_FORM_CLASS_NAME}`);
    const formCloseElement = this.element.querySelector(`.${ROLLUP_BUTTON_CLASS_NAME}`);
    const typeFieldsetElement = this.element.querySelector(`.${TYPE_FIELDSET_CLASS_NAME}`);
    const destinationInputElement = this.element.querySelector(`.${DESTINATION_INPUT_CLASS_NAME}`);
    const priceInputElement = this.element.querySelector(`.${PRICE_INPUT_CLASS_NAME}`);
    const availableOffersElement = this.element.querySelector(`.${AVAILABLE_OFFERS_CLASS_NAME}`);

    editFormElement.addEventListener('submit', this.#formSubmitHandler);
    formCloseElement?.addEventListener('click', this.#formCloseHandler);
    typeFieldsetElement.addEventListener('change', this.#typeChangeHandler);
    destinationInputElement.addEventListener('change', this.#destinationChangeHandler);
    priceInputElement.addEventListener('input', this.#priceChangeHandler);
    availableOffersElement?.addEventListener('change', this.#offerChangeHandler);
    this.#setDatepickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  #typeChangeHandler = (evt) => {
    const targetType = evt.target.value;
    const typeOffers = this.#offers.filter((item) => item.type === targetType);

    // Выбранные офферы обнуляем при смене типа
    this.updateElement({
      type: targetType,
      offersType: typeOffers[0],
      offers: []
    });
  };

  // Сохраняем выбранные офферы даже при смене города
  #offerChangeHandler = () => {
    const checkedOffers = [...this.element.querySelectorAll('.event__offer-checkbox:checked')]
      .map((element) => element.dataset.offerId);

    this._setState({
      offers: checkedOffers
    });
  };

  #destinationChangeHandler = (evt) => {
    const targetDestination = evt.target.value;
    const foundDestination = this.#destinationsAll.find((item) => item.name === targetDestination);

    if (!foundDestination) {
      evt.target.value = this._state.destinationFromId.name;
      return;
    }

    this.updateElement({
      destination: foundDestination.id,
      destinationFromId: foundDestination
    });
  };

  #priceChangeHandler = (evt) => {
    let targetPrice = evt.target.value;

    if(!Number(targetPrice)) {
      evt.target.value = targetPrice.slice(0, -1);
      targetPrice = evt.target.value;
    }

    if(Number(targetPrice)) {
      this._setState({
        basePrice: targetPrice
      });
    }
  };

  static parsePointToState(point, destination, offersType) {
    return {...point,
      destinationFromId: destination,
      offersType
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state, basePrice: Number(state.basePrice) };
    delete point.destinationFromId;
    delete point.offersType;
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
