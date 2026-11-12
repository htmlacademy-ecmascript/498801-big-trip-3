import dayjs from 'dayjs';
import { FilterType } from './consts';

// Генерация случайного числа от a до b (включая a и b)
const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

// Получение случайного элемента из массива
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

// Найти и вернуть элемент по id
const getElementById = (idNumber, elements) => {
  const element = elements.find((el) => el.id === idNumber);
  return element ? element : '';
};

const humanizeDueDate = (dueDate, format) => (dueDate ? dayjs(dueDate).format(format) : '');

const getDuration = (start, end) => {
  const duration = dayjs.duration(dayjs(end).diff(dayjs(start)));
  if (duration.days()) {
    return duration.format('DD[d] HH[h] mm[m]');
  }
  if (duration.hours()) {
    return duration.format('HH[h] mm[m]');
  }

  return duration.format('mm[m]');
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

export { getRandomArrayElement, getRandomInteger, getElementById, humanizeDueDate, getDuration, filter, updateItem, sortByDay, sortByTime, sortByPrice };
