import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

const SORT_ITEMS = [
  { type: SortType.DAY, name: 'day', label: 'Day', isDisabled: false },
  { type: SortType.EVENT, name: 'event', label: 'Event', isDisabled: true },
  { type: SortType.TIME, name: 'time', label: 'Time', isDisabled: false },
  { type: SortType.PRICE, name: 'price', label: 'Price', isDisabled: false },
  { type: SortType.OFFERS, name: 'offer', label: 'Offers', isDisabled: true },
];

const createSortItemTemplate = ({ type, name, label, isDisabled }, currentSortType) =>
  /* HTML */
  `<div class="trip-sort__item  trip-sort__item--${name}">
    <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" data-sort-type="${type}" ${type === currentSortType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} />
    <label class="trip-sort__btn" for="sort-${name}">${label}</label>
  </div>`;

const createSortTemplate = (currentSortType) =>
  /* HTML */
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORT_ITEMS.map((item) => createSortItemTemplate(item, currentSortType)).join('')}
  </form>`;

export default class SortView extends AbstractView {
  #currentSortType = null;
  #onSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}
