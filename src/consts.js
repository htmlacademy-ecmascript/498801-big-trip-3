const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Amsterdam', 'Geneva', 'Chamonix', 'Berlin', 'Prague', 'London', 'Paris', 'Rome', 'Madrid', 'Vienna', 'Brussels', 'Zurich'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
  'Phasellus eros mauris, condimentum sed nibh vitae.',
];

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

// что перерисовывать после изменения модели
const UpdateType = {
  PATCH: 'PATCH', // обновилась одна точка - перерисовать только ее
  MINOR: 'MINOR', // изменился список - перерисовать список
  MAJOR: 'MAJOR', // изменился фильтр - перерисовать все и сбросить сортировку
};

export { EVENT_TYPES, CITIES, DESCRIPTIONS, TextNoEvent, FilterType, SortType, UserAction, UpdateType };
