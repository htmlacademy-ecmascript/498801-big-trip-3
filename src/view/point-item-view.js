import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDueDate, getDuration, capitalize, escapeHtml } from '../utils.js';
import { DateFormat } from '../consts.js';

const ROLLUP_BUTTON_CLASS_NAME = 'event__rollup-btn';
const FAVORITE_BUTTON_CLASS_NAME = 'event__favorite-btn';
const FAVORITE_ACTIVE_CLASS_NAME = 'event__favorite-btn--active';

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
              <span class="event__offer-title">${escapeHtml(offer.title)}</span>
              &plus;&euro;
              <span class="event__offer-price">${escapeHtml(offer.price)}</span>
            </li>`,
    )
    .join('')}
    </ul>`;
};

const createPointItemTemplate = (pointState) => {
  const { type, dateFrom, dateTo, basePrice, isFavorite } = pointState.point;
  const city = pointState.destination?.name ?? '';
  const favoriteClass = isFavorite ? FAVORITE_ACTIVE_CLASS_NAME : '';

  return /* HTML */ `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDueDate(dateFrom, DateFormat.ATTRIBUTE_DAY)}">${humanizeDueDate(dateFrom, DateFormat.POINT_DAY)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${escapeHtml(type)}.png" alt="Event type icon" />
      </div>
      <h3 class="event__title">${escapeHtml(capitalize(type))} ${escapeHtml(city)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${escapeHtml(dateFrom)}">${humanizeDueDate(dateFrom, DateFormat.TIME)}</time>
          &mdash;
          <time class="event__end-time" datetime="${escapeHtml(dateTo)}">${humanizeDueDate(dateTo, DateFormat.TIME)}</time>
        </p>
        <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">&euro; <span class="event__price-value">${escapeHtml(basePrice)}</span></p>
      ${createOffersTemplate(pointState.offers)}
      <button class="event__favorite-btn ${favoriteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointItemView extends AbstractView {
  #state = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({ point, offers, destination, onEditClick, onFavoriteClick }) {
    super();
    this.#state = { point, offers, destination };
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#setEventListeners();
  }

  get template() {
    return createPointItemTemplate(this.#state);
  }

  #setEventListeners() {
    const rollupButtonElement = this.element.querySelector(`.${ROLLUP_BUTTON_CLASS_NAME}`);
    const favoriteButtonElement = this.element.querySelector(`.${FAVORITE_BUTTON_CLASS_NAME}`);

    rollupButtonElement.addEventListener('click', this.#editClickHandler);
    favoriteButtonElement.addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = () => {
    this.#onEditClick();
  };

  #favoriteClickHandler = () => {
    this.#onFavoriteClick();
  };
}
