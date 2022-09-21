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

  resendMailVerify(userId: number) {
    const url = `/public/users/resend-email-verify/${userId}`;
    return this.post(url, {});
  }

  verifyMail(uid: number, vid: string) {
    const url = `/public/users/verify-email/?uid=${uid}&vid=${vid}`;
    return this.get(url);
  }

  getInfoUser() {
    const url = `/my/users/profile`;
    return this.get(url);
  }
}
