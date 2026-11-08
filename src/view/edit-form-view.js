import AbstractView from '../framework/view/abstract-view';
import { humanizeDueDate } from '../utils';

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
            <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${offer.type === type ? 'checked' : ''} />
            <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}">
              ${offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
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
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${pointOffers.includes(id) ? 'checked' : ''} />
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

const createEditFormViewTemplate = (point, destination, destinationsAll, offers, offersType) => {
  const { id, type, dateFrom, dateTo, basePrice } = point;

  const rollupButton = id ? createRollupButtonTemplate() : '';
  const cancelButtonText = id ? 'Delete' : 'Cancel';
  /* HTML */
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeTemplate(type, offers, id)}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1"> ${type} </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" />
          <datalist id="destination-list-1">
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

export default class EditFormView extends AbstractView {
  #point = null;
  #destination = null;
  #destinationsAll = null;
  #offers = null;
  #offersType = null;
  #onFormSubmit = null;
  #onCloseClick = null;

  constructor({ point, destination, destinationsAll, offers, offersType, onFormSubmit, onCloseClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#destinationsAll = destinationsAll;
    this.#offers = offers;
    this.#offersType = offersType;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseClick = onCloseClick;

    const editFormElement = this.element.querySelector('.event--edit');
    const formCloseElement = this.element.querySelector('.event__rollup-btn');
    editFormElement.addEventListener('submit', this.#formSubmitHandler);
    formCloseElement.addEventListener('click', this.#formCloseHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit();
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  get template() {
    return createEditFormViewTemplate(
      this.#point,
      this.#destination,
      this.#destinationsAll,
      this.#offers,
      this.#offersType
    );
  }
}
