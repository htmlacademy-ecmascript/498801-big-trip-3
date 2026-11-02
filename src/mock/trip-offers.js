import { getRandomInteger } from '../utils';

const MIN_PRICE = 100;
const MAX_PRICE = 1500;

export const tripOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa30',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Drive a little bit slowly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa32',
        title: 'Choose the radio station',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa33',
        title: 'Open the door before and after',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa34',
        title: 'Modern sights mostly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa34',
        title: 'Modern sights mostly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa35',
        title: 'A way without lots of people',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa36',
        title: 'Choose the time of check-in',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa37',
        title: 'Choose the time of check-out',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa38',
        title: 'Add breakfast',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa30',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Drive a little bit slowly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'drive',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa30',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Drive a little bit slowly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'bus',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa30',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'ship',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa30',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Drive a little bit slowly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa30',
        title: 'Drive faster!',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Drive a little bit slowly',
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      },
    ],
  },
];
