import ApiService from '../framework/api-service.js';
import { adaptToServer } from './adapter-service.js';

const Method = {
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const ApiResource = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: ApiResource.POINTS})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: ApiResource.DESTINATIONS })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: ApiResource.OFFERS })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${ApiResource.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: ApiResource.POINTS,
      method: Method.POST,
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${ApiResource.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
