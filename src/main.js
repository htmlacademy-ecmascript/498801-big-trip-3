import { render, RenderPosition } from './render';
import InfoView from './view/info-view';
import FilterView from './view/filter-view';
import SortView from './view/sort-view';
import EventsPresenter from './presenter/events-presenter';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter({ eventsContainer: eventsElement });

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filtersElement);
render(new SortView(), eventsElement);

eventsPresenter.init();
