import { render } from '../render';
import EventsListView from '../view/events-list-view';
import EventItemView from '../view/event-item-view';
import EditFormView from '../view/edit-form-view';
import MessageView from '../view/message-view';

const eventsElement = document.querySelector('.trip-events');

export default class TripEventsPresenter {
  eventsListComponent = new EventsListView();
  eventsListElement = this.eventsListComponent.getElement();
  messageComponent = new MessageView();

  constructor({ eventsContainer, tripModel }) {
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
    //this.addFormComponent = new EditFormView({ point: this.tripModel.points[0] });
    this.editFormComponent = new EditFormView({
      point: this.tripModel.points[0],
      destination: this.tripModel.getDestinationById(this.tripModel.points[0].destination),
      destinationsAll: this.tripModel.destinations,
      offers: this.tripModel.offers,
      offersType: this.tripModel.getOffersByType(this.tripModel.points[0].type),
    });
  }

  init() {
    render(this.editFormComponent, this.eventsListElement);
    //render(this.addFormComponent, this.eventsListElement);
    render(this.eventsListComponent, this.eventsContainer);

    for (let i = 1; i < this.tripModel.points.length; i++) {
      const point = this.tripModel.points[i];
      const eventItemComponent = new EventItemView({
        point: point,
        offers: this.tripModel.getOffersById(point.type, point.offers),
        destination: this.tripModel.getDestinationById(point.destination),
      });
      render(eventItemComponent, this.eventsListElement);
    }

    render(this.messageComponent, eventsElement);
  }
}
