import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = () =>
  /* HTML */
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointButtonView extends AbstractView {
  #onClick = null;

  get template() {
    return createNewPointButtonTemplate();
  }

  setClickHandler(callback) {
    this.#onClick = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  setDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }

  #clickHandler = () => {
    this.#onClick();
  };
}
