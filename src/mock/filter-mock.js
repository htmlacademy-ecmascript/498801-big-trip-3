import { filter } from '../utils.js';

const generateFilters = (points) =>
  Object.entries(filter).map(([type, filterPoints]) => ({
    type,
    count: filterPoints(points).length,
  }));

export { generateFilters };
