import AbstractView from '../framework/view/abstract-view.js';

const createLoadingTemplate = () =>
  /* HTML */
  `<p class="trip-events__msg">
    Loading...
  </p>`;

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
