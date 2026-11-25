const DEFAULT_POINT_TYPE = 'flight';
const ESCAPE_KEY = 'Escape';

const DateFormat = {
  FORM: 'DD/MM/YY HH:mm',
  POINT_DAY: 'MMM D',
  TIME: 'HH:mm',
  ATTRIBUTE_DAY: 'YYYY-MM-DD',
  TRIP_DAY: 'D MMM',
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const TextNoEvent = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const ErrorMessage = {
  UPDATE_POINT: 'Can\'t update point',
  UPDATE_UNEXISTING_POINT: 'Can\'t update unexisting point',
  ADD_POINT: 'Can\'t add point',
  DELETE_POINT: 'Can\'t delete point',
  DELETE_UNEXISTING_POINT: 'Can\'t delete unexisting point',
};

export { DEFAULT_POINT_TYPE, DateFormat, TextNoEvent, FilterType, SortType, UserAction, UpdateType, ErrorMessage, ESCAPE_KEY };
