import { render } from '../render';
import EventsListView from '../view/events-list-view';
import EventItemView from '../view/event-item-view';
import AddFormView from '../view/add-form-view';
import EditFormView from '../view/edit-form-view';
import MessageView from '../view/message-view';

const EVENT_COUNT = 3;
const eventsElement = document.querySelector('.trip-events');

export default class TripEventsPresenter {
  eventsListComponent = new EventsListView();
  eventsListElement = this.eventsListComponent.getElement();
  addFormComponent = new AddFormView();
  editFormComponent = new EditFormView();
  messageComponent = new MessageView();

  constructor({ eventsContainer }) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(this.editFormComponent, this.eventsListElement);
    render(this.addFormComponent, this.eventsListElement);
    render(this.eventsListComponent, this.eventsContainer);

    for (let i = 0; i < EVENT_COUNT; i++) {
      const eventItemComponent = new EventItemView();
      render(eventItemComponent, this.eventsListElement);
    }

    render(this.messageComponent, eventsElement);
  }
}
