import dayjs from 'dayjs';
import he from 'he';
import { FilterType, DateFormat } from './consts.js';

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;
const MAX_CITIES_IN_TITLE = 3;
const ROUTE_ELLIPSIS = '...';
const TRIP_DATES_SEPARATOR = ' — ';

const humanizeDueDate = (dueDate, format) => (dueDate ? dayjs(dueDate).format(format) : '');

const pad = (value) => String(value).padStart(2, '0');

const getDateDiff = (dateFrom, dateTo, unit = 'millisecond') =>
  dayjs(dateTo).diff(dayjs(dateFrom), unit);

const getDuration = (dateFrom, dateTo) => {
  const diff = getDateDiff(dateFrom, dateTo, 'minute');
  const days = Math.floor(diff / MINUTES_IN_DAY);
  const hours = Math.floor((diff % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = diff % MINUTES_IN_HOUR;

  if (days > 0) {
    return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M`;
  }

  if (hours > 0) {
    return `${pad(hours)}H ${pad(minutes)}M`;
  }

  return `${pad(minutes)}M`;
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => {
    const now = dayjs();
    return points.filter((point) => dayjs(point.dateFrom).isAfter(now));
  },
  [FilterType.PRESENT]: (points) => {
    const now = dayjs();
    return points.filter((point) =>
      !dayjs(point.dateFrom).isAfter(now) && !dayjs(point.dateTo).isBefore(now));
  },
  [FilterType.PAST]: (points) => {
    const now = dayjs();
    return points.filter((point) => dayjs(point.dateTo).isBefore(now));
  },
};

const generateFilters = (points) =>
  Object.entries(filter).map(([type, filterPoints]) => ({
    type,
    count: filterPoints(points).length,
  }));

// Сортировки:
// от старых к новым по дате начала (по умолчанию)
const sortByDay = (a, b) => getDateDiff(b.dateFrom, a.dateFrom);

// по длительности, от самой долгой
const sortByTime = (a, b) =>
  getDateDiff(b.dateFrom, b.dateTo) - getDateDiff(a.dateFrom, a.dateTo);

// по цене, от самой дорогой
const sortByPrice = (a, b) => b.basePrice - a.basePrice;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const escapeHtml = (value) => he.encode(String(value));

const getRouteCities = (cities) =>
  cities.length > MAX_CITIES_IN_TITLE
    ? [cities[0], ROUTE_ELLIPSIS, cities[cities.length - 1]]
    : cities;

const getTripDates = (dateFrom, dateTo) => {
  if (dayjs(dateFrom).isSame(dateTo, 'month')) {
    return [
      humanizeDueDate(dateFrom, DateFormat.TRIP_DAY_NUMBER),
      humanizeDueDate(dateTo, DateFormat.TRIP_DAY),
    ].join(TRIP_DATES_SEPARATOR);
  }

  return [
    humanizeDueDate(dateFrom, DateFormat.TRIP_DAY),
    humanizeDueDate(dateTo, DateFormat.TRIP_DAY),
  ]
    .join(TRIP_DATES_SEPARATOR)
    .toUpperCase();
};

export {
  humanizeDueDate,
  getDuration,
  filter,
  sortByDay,
  sortByTime,
  sortByPrice,
  generateFilters,
  capitalize,
  escapeHtml,
  getRouteCities,
  getTripDates,
};
