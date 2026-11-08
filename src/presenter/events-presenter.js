import { render, replace } from '../framework/render';
import EventsListView from '../view/events-list-view';
import EventItemView from '../view/event-item-view';
import EditFormView from '../view/edit-form-view';
import MessageView from '../view/message-view';

const eventsElement = document.querySelector('.trip-events');

export default class TripEventsPresenter {
  #eventsContainer = null;
  #tripModel = null;

  #eventsListComponent = new EventsListView();
  #eventsListElement = this.#eventsListComponent.element;
  #messageComponent = new MessageView();
  #editFormComponent = null;

  constructor({ eventsContainer, tripModel }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
  }

  /**
   * Метод для отрисовки точки маршрута
   * @param {Object} point Объект с данными точки
   */
  #renderPoint (point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const eventItemComponent = new EventItemView({
      point,
      offers: this.#tripModel.getOffersById(point.type, point.offers),
      destination: this.#tripModel.getDestinationById(point.destination),
      onEditClick: () => {
        replacePointToForm();
      }
    });

    const editFormComponent = new EditFormView({
      point,
      destination: this.#tripModel.getDestinationById(point.destination),
      destinationsAll: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      offersType: this.#tripModel.getOffersByType(point.type),
      onFormSubmit: () => {
        replaceFormToPoint();
      },
      onCloseClick: () => {
        replaceFormToPoint();
      },
    });

    function replacePointToForm() {
      replace(editFormComponent, eventItemComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint() {
      replace(eventItemComponent, editFormComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(eventItemComponent, this.#eventsListElement);
  }

  #renderTripBoard () {
    const pointsLength = this.#tripModel.points.length;

    if(pointsLength === 0) {
      render(this.#messageComponent, eventsElement);
      return;
    }

    render(this.#eventsListComponent, this.#eventsContainer);

    for (let i = 0; i < pointsLength; i++) {
      const point = this.#tripModel.points[i];
      this.#renderPoint(point);
    }
  }

  init() {
    this.#renderTripBoard();
  }
}
