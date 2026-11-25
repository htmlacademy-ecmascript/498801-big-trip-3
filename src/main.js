import { render } from './framework/render.js';
import PointsPresenter from './presenter/points-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import InfoPresenter from './presenter/info-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './server/points-api-service.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { UpdateType } from './consts.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic Xq7mP2vK9tLd4Rz';

const tripMainElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

const newPointButtonComponent = new NewPointButtonView();
const service = new PointsApiService(END_POINT, AUTHORIZATION);
const tripModel = new TripModel({ pointsApiService: service });
const filterModel = new FilterModel();

const pointsPresenter = new PointsPresenter({
  eventsContainer: eventsElement,
  tripModel,
  filterModel,
  onNewPointClose: () => newPointButtonComponent.setDisabled(false),
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  tripModel,
});

const infoPresenter = new InfoPresenter({
  container: tripMainElement,
  tripModel,
});

newPointButtonComponent.setClickHandler(() => {
  newPointButtonComponent.setDisabled(true);
  pointsPresenter.createPoint();
});

tripModel.addObserver((updateType) => {
  if (updateType === UpdateType.INIT) {
    newPointButtonComponent.setDisabled(false);
  }
});

newPointButtonComponent.setDisabled(true);
render(newPointButtonComponent, tripMainElement);

filterPresenter.init();
pointsPresenter.init();
infoPresenter.init();
tripModel.init();
