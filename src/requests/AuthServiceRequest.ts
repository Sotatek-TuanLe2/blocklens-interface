import BaseRequest from './BaseRequest';
import config from 'src/config';

export default class AuthServiceRequest extends BaseRequest {
  getUrlPrefix() {
    return config.api.baseUrlApi;
  }

  getAPIKey() {
    const url = `/my/users/api-key`;
    return this.get(url);
  }

  updateAPIKey() {
    const url = `/my/users/api-key`;
    return this.put(url);
  }
}
