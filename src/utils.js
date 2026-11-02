import dayjs from 'dayjs';

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

export { getRandomArrayElement, getRandomInteger, getElementById, humanizeDueDate, getDuration };
