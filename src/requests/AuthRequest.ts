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

  loginByGoogle(params: any) {
    const url = `/public/users/signin-gg`;
    return this.post(url, params);
  }

  resendMailVerify(email: string) {
    const url = `/public/users/resend-email`;
    return this.post(url, { email });
  }

  verifyMail(uid: number, vid: string) {
    const url = `/public/users/verify-email/?uid=${uid}&vid=${vid}`;
    return this.get(url);
  }

  changePassword(params: { newPassword: string; oldPassword: string }) {
    const url = '/my/users/change-password';
    return this.put(url, params);
  }

  forgotPassword(data: any) {
    const url = '/public/users/forgot-password';
    return this.post(url, data);
  }

  resetPassword(data: any) {
    const url = '/my/users/password';
    return this.put(url, data);
  }

  attachWalletAddress(data: {
    address: string;
    signature: string;
  }) {
    const url = '/my/users/wallet';
    return this.put(url, data);
  }
}
