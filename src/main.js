import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { render, RenderPosition } from './framework/render';
import InfoView from './view/info-view';
import PointsPresenter from './presenter/points-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model';
import FilterModel from './model/filter-model.js';
dayjs.extend(durationPlugin);

const tripMainElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const tripModel = new TripModel();
const filterModel = new FilterModel();

const pointsPresenter = new PointsPresenter({
  eventsContainer: eventsElement,
  tripModel,
  filterModel,
  handleNewPointClose: () => {
    newPointButton.disabled = false;
  },
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  tripModel,
});

newPointButton.addEventListener('click', () => {
  newPointButton.disabled = true;
  pointsPresenter.createPoint();
});

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
pointsPresenter.init();
