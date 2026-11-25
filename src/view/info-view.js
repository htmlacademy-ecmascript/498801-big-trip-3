import AbstractView from '../framework/view/abstract-view.js';
import { escapeHtml } from '../utils.js';

const createInfoTemplate = ({ cities, dates, cost }) =>
  /* HTML */
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities.map((city) => escapeHtml(city)).join(' &mdash; ')}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;

export default class InfoView extends AbstractView {
  #info = null;

  constructor({ cities, dates, cost }) {
    super();
    this.#info = { cities, dates, cost };
  }

  get template() {
    return createInfoTemplate(this.#info);
  }
}
