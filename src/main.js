import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { render, RenderPosition } from './framework/render';
import InfoView from './view/info-view';
import PointsPresenter from './presenter/points-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model';
import FilterModel from './model/filter-model.js';
import PointsApiService from './server/points-api-service.js';
import { UpdateType } from './consts';
dayjs.extend(durationPlugin);

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic 666zelenka';

const tripMainElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const newPointButton = document.querySelector('.trip-main__event-add-btn');

newPointButton.disabled = true;

const service = new PointsApiService(END_POINT, AUTHORIZATION);
const tripModel = new TripModel({
  pointsApiService: service
});

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

tripModel.addObserver((updateType) => {
  if (updateType === UpdateType.INIT) {
    newPointButton.disabled = false;
  }
});

filterPresenter.init();
pointsPresenter.init();
tripModel.init();
