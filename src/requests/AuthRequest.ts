import BaseRequest from './BaseRequest';
import config from 'src/config';
import { RECAPTCHA_ACTIONS } from 'src/utils/common';

export default class AuthRequest extends BaseRequest {
  getUrlPrefix() {
    return config.api.baseUrlApi;
  }

  signUp(params: any) {
    const url = `/users/signup`;
    return this.post(url, params, RECAPTCHA_ACTIONS.HOMEPAGE);
  }

  login(params: any) {
    const url = `/users/signin`;
    return this.post(url, params, RECAPTCHA_ACTIONS.LOGIN);
  }

  logout() {
    const url = '/users/logout';
    return this.post(url);
  }

  loginByGoogle(params: any) {
    const url = `/users/signin-gg`;
    return this.post(url, params);
  }

  resendMailVerify(email: string) {
    const url = `/users/resend-email`;
    return this.post(url, { email });
  }

  verifyMail(token: string) {
    const url = `/users/verify-email/?token=${token}`;
    return this.get(url);
  }

  changePassword(params: { newPassword: string; oldPassword: string }) {
    const url = '/users/change-password';
    return this.put(url, params);
  }

  forgotPassword(data: any) {
    const url = '/users/forgot-password';
    return this.post(url, data, RECAPTCHA_ACTIONS.HOMEPAGE);
  }

  resetPassword(data: any) {
    const url = '/users/reset-password';
    return this.put(url, data);
  }

  attachWalletAddress(data: { address: string; signature: string }) {
    const url = '/users/my/wallet';
    return this.put(url, data);
  }

  unlinkWallet() {
    const url = '/users/my/unlink-wallet';
    return this.put(url);
  }
}
