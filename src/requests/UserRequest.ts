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

  contactToAdmin(params: any) {
    const url = `/public/users/contact`;
    return this.post(url, params);
  }

  updateNotificationFlag(params: any) {
    const url = `/my/users/notification`;
    return this.put(url, params);
  }

  updateBillingEmail(params: any) {
    const url = `/my/users/billing-email`;
    return this.put(url, params);
  }

  getTopUpHistories(params: any) {
    const url = `/my/users/topup-histories`;
    return this.get(url, params);
  }
}
