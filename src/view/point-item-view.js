import AbstractView from '../framework/view/abstract-view';
import { humanizeDueDate, getDuration } from '../utils';

const ROLLUP_BUTTON_CLASS_NAME = 'event__rollup-btn';
const FAVORITE_BUTTON_CLASS_NAME = 'event__favorite-btn';

const createOffersTemplate = (offers) => {
  if (offers.length === 0) {
    return '';
  }

  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers
    .map(
      (offer) =>
        `<li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </li>`,
    )
    .join('')}
    </ul>`;
};

const createEventItemTemplate = (pointState) => {
  const { type, dateFrom, dateTo, basePrice, isFavorite } = pointState.point;
  const { name: city } = pointState.destination;
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return /* HTML */ `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-20">${humanizeDueDate(dateFrom, 'MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon" />
      </div>
      <h3 class="event__title">${type} ${city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${humanizeDueDate(dateFrom, 'HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${humanizeDueDate(dateTo, 'HH:mm')}</time>
        </p>
        <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">&euro;&nbsp;<span class="event__price-value">${basePrice}</span></p>
      ${createOffersTemplate(pointState.offers)}
      <button class="event__favorite-btn" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon ${favoriteClass}" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class EventItemView extends AbstractView {
  #state = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({ point, offers, destination, onEditClick, onFavoriteClick }) {
    super();
    this.#state = {
      point,
      offers,
      destination,
    };
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#setEventListeners();
  }

  #setEventListeners = () => {
    const rollupButtonElement = this.element.querySelector(`.${ROLLUP_BUTTON_CLASS_NAME}`);
    const favoriteButtonElement = this.element.querySelector(`.${FAVORITE_BUTTON_CLASS_NAME}`);

    rollupButtonElement.addEventListener('click', this.#editClickHandler);
    favoriteButtonElement.addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

  get template() {
    return createEventItemTemplate(this.#state);
  }
}
