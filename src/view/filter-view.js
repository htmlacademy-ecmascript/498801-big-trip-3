import AbstractView from '../framework/view/abstract-view';

const createFilterItemTemplate = ({ type, count }, currentFilterType) => `
  <div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${type === currentFilterType ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`;

const createFilterTemplate = (filters, currentFilterType) => `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, handleFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = handleFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    this.#handleFilterTypeChange(evt.target.value);
  };


  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }
}
