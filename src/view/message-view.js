import AbstractView from '../framework/view/abstract-view';
import { TextNoEvent } from '../consts';

const createMessageTemplate = () =>
  /* HTML */
  `<p class="trip-events__msg">${TextNoEvent.EVERYTHING}</p>`;

export default class MessageView extends AbstractView {
  get template() {
    return createMessageTemplate();
  }
}
