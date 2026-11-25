import dayjs from 'dayjs';
import { FilterType } from './consts';

// Найти и вернуть элемент по id
const getElementById = (idNumber, elements) => {
  const element = elements.find((el) => el.id === idNumber);
  return element ? element : '';
};

const humanizeDueDate = (dueDate, format) => (dueDate ? dayjs(dueDate).format(format) : '');

const pad = (value) => String(value).padStart(2, '0');

const getDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const days = Math.floor(diff / 1440);
  const hours = Math.floor((diff % 1440) / 60);
  const minutes = diff % 60;

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
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) =>
      !dayjs(point.dateFrom).isAfter(dayjs()) && !dayjs(point.dateTo).isBefore(dayjs())),
  [FilterType.PAST]: (points) =>
    points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
};

const generateFilters = (points) =>
  Object.entries(filter).map(([type, filterPoints]) => ({
    type,
    count: filterPoints(points).length,
  }));

const updateItem = (items, newItem) =>
  items.map((item) => (item.id === newItem.id ? newItem : item));

// Сортировки:
// от старых к новым по дате начала (по умолчанию)
const sortByDay = (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom));

// по длительности, от самой долгой
const sortByTime = (a, b) => {
  const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
  const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
  return durationB - durationA;
};

// по цене, от самой дорогой
const sortByPrice = (a, b) => b.basePrice - a.basePrice;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export { getElementById, humanizeDueDate, getDuration, filter, updateItem, sortByDay, sortByTime, sortByPrice, generateFilters, capitalize };
