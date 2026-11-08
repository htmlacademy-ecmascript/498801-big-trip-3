import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { render, RenderPosition } from './framework/render';
import InfoView from './view/info-view';
import SortView from './view/sort-view';
import EventsPresenter from './presenter/events-presenter';
import TripModel from './model/trip-model';
dayjs.extend(durationPlugin);

const tripMainElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');

const tripModel = new TripModel();
const eventsPresenter = new EventsPresenter({
  eventsContainer: eventsElement,
  tripModel
});

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new SortView(), eventsElement);

eventsPresenter.init();
