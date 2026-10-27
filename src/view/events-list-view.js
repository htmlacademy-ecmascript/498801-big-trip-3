import { createElement } from '../render';

const createEventsListTemplate = () =>
  /* HTML */
  '<ul class="trip-events__list"></ul>';

export default class EventsListView {
  getTemplate() {
    return createEventsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
