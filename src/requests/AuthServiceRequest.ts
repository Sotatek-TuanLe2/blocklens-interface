import BaseRequest from './BaseRequest';
import config from 'src/config';

export default class AuthServiceRequest extends BaseRequest {
  getUrlPrefix() {
    return config.api.authApi;
  }

  getAPIKey() {
    const url = `/auth/api-key`;
    return this.get(url);
  }

  updateAPIKey() {
    const url = `/auth/api-key`;
    return this.put(url);
  }
}
