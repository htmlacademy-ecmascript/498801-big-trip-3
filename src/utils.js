import dayjs from 'dayjs';
import he from 'he';
import { FilterType, DateFormat } from './consts.js';

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;
const MAX_CITIES_IN_TITLE = 3;
const ROUTE_ELLIPSIS = '...';
const TRIP_DATES_SEPARATOR = ' — ';
const PAD_LENGTH = 2;
const PAD_SYMBOL = '0';

const TimeUnit = {
  MINUTE: 'minute',
  MILLISECOND: 'millisecond',
};

const humanizeDueDate = (dueDate, format) => (dueDate ? dayjs.utc(dueDate).format(format) : '');

const convertToPickerDate = (isoDate) => {
  if (!isoDate) {
    return null;
  }

  const date = dayjs.utc(isoDate);

  return new Date(date.year(), date.month(), date.date(), date.hour(), date.minute());
};

const convertFromPickerDate = (pickerDate) =>
  new Date(Date.UTC(
    pickerDate.getFullYear(),
    pickerDate.getMonth(),
    pickerDate.getDate(),
    pickerDate.getHours(),
    pickerDate.getMinutes(),
  )).toISOString();

const pad = (value) => String(value).padStart(PAD_LENGTH, PAD_SYMBOL);

const getDateDiff = (dateFrom, dateTo, unit = TimeUnit.MILLISECOND) =>
  dayjs(dateTo).diff(dayjs(dateFrom), unit);

const getDuration = (dateFrom, dateTo) => {
  const diff = getDateDiff(dateFrom, dateTo, TimeUnit.MINUTE);
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
const sortByDay = (pointA, pointB) => getDateDiff(pointB.dateFrom, pointA.dateFrom);

// по длительности, от самой долгой
const sortByTime = (pointA, pointB) =>
  getDateDiff(pointB.dateFrom, pointB.dateTo) - getDateDiff(pointA.dateFrom, pointA.dateTo);

// по цене, от самой дорогой
const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const escapeHtml = (value) => he.encode(String(value));

const getRouteCities = (cities) =>
  cities.length > MAX_CITIES_IN_TITLE
    ? [cities[0], ROUTE_ELLIPSIS, cities[cities.length - 1]]
    : cities;

const getTripDates = (dateFrom, dateTo) =>
  [humanizeDueDate(dateFrom, DateFormat.TRIP_DAY), humanizeDueDate(dateTo, DateFormat.TRIP_DAY)]
    .join(TRIP_DATES_SEPARATOR)
    .toUpperCase();

export {
  humanizeDueDate,
  convertToPickerDate,
  convertFromPickerDate,
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
