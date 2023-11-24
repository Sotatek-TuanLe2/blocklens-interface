import BaseRequest from './BaseRequest';
import config from 'src/config';

export default class UserRequest extends BaseRequest {
  getUrlPrefix() {
    return config.api.baseUrlApi;
  }

  getInfoUser() {
    const url = `/users/my/profile`;
    return this.get(url);
  }

  editInfoUser(params: any) {
    const url = `/users/my/profile`;
    return this.put(url, params);
  }

  contactToAdmin(params: any) {
    const url = `/users/contact`;
    return this.post(url, params);
  }

  updateNotificationFlag(params: any) {
    const url = `/users/my/notification`;
    return this.put(url, params);
  }

  updateBillingEmail(params: any) {
    const url = `/users/my/billing-email`;
    return this.put(url, params);
  }

  getTopUpHistories(params: any) {
    const url = `/users/my/topup-histories`;
    return this.get(url, params);
  }
}
