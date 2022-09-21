import BaseRequest from './BaseRequest';
import config from 'src/config';

export default class UserRequest extends BaseRequest {
  getUrlPrefix() {
    return config.api.baseUrlApi;
  }

  getInfoUser() {
    const url = `/my/users/profile`;
    return this.get(url);
  }

  editInfoUser(params: any) {
    const url = `/my/users/profile`;
    return this.put(url, params);
  }
}
