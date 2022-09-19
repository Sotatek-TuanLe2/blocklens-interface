import BaseRequest from './BaseRequest';
import config from 'src/config';

export default class AuthRequest extends BaseRequest {
  getUrlPrefix() {
    return config.api.baseUrlApi;
  }

  signUp(params: any) {
    const url = `/public/users/signup`;
    return this.post(url, params);
  }

  login(params: any) {
    const url = `/public/users/signin`;
    return this.post(url, params);
  }
}
