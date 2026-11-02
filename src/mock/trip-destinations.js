import { getRandomInteger, getRandomArrayElement } from '../utils';
import { CITIES, DESCRIPTIONS } from '../consts';

const MIN_NUMBER = 1;
const MAX_NUMBER = 20;

const tripDestinations = [
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e01',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e02',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e03',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e05',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e06',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e07',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e08',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e09',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e00',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
      {
        src: `https://24.objects.htmlacademy.pro/static/destinations/${getRandomInteger(MIN_NUMBER, MAX_NUMBER)}.jpg`,
        description: getRandomArrayElement(DESCRIPTIONS),
      },
    ],
  },
];

export { tripDestinations };
