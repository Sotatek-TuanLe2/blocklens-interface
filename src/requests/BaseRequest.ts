import { load } from 'recaptcha-v3';
import retry from 'async-retry';
import config from 'src/config';
import axios from 'axios';
import Storage from 'src/utils/utils-storage';
import {
  setAuthorizationToRequest,
  setRecaptchaToRequest,
} from 'src/utils/utils-auth';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { RECAPTCHA_ACTIONS } from 'src/utils/common';
import { COMMON_ERROR_MESSAGE } from 'src/constants';
import store from 'src/store';
import { setUserAuth } from 'src/store/user';

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    const status = response?.status;

    if (
      status === 401 &&
      response.data?.message.toString() !== 'Credential is not correct'
    ) {
      const refreshToken = Storage.getRefreshToken();
      if (!refreshToken) {
        return AppBroadcast.dispatch('REQUEST_SIGN_IN');
      }

      try {
        const response = await axios.post(
          config.api.baseUrlApi + '/public/users/refresh-token',
          { refreshToken },
        );
        store().store.dispatch(setUserAuth(response));
        return axios(error.config);
      } catch (error) {
        return AppBroadcast.dispatch('REQUEST_SIGN_IN');
      }
    }

    if (status === 403) {
      return AppBroadcast.dispatch('LOGOUT_USER');
    }

    if (response) {
      console.log('===errorHandler', JSON.stringify(response));
      console.log('===errorHandler data', JSON.stringify(response.data));
      console.log('===errorHandler status', JSON.stringify(status));
      console.log('===errorHandler headers', JSON.stringify(response.headers));
    } else {
      console.log('==errorHandler', JSON.stringify(error));
    }

    if (status === 0 || status === 500) {
      // Network error
      throw new Error(COMMON_ERROR_MESSAGE);
    }

    if (response && response.data && response.data.message) {
      if (typeof response.data.message === 'string') {
        throw new Error(response.data.message);
      }
      throw new Error(response.data.message[0]);
    }
    if (response && response.data && response.data.error) {
      throw new Error(response.data.error);
    }

    throw error;
  },
);

export default class BaseRequest {
  protected accessToken = '';
  constructor() {
    const accessToken = Storage.getAccessToken();
    if (accessToken) {
      this.accessToken = accessToken;
      setAuthorizationToRequest(this.accessToken);
    }
  }

  getUrlPrefix() {
    return config.api.baseUrlApi;
  }

  async getAndSetRecaptcha(
    recaptchaAction: typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS],
  ) {
    return retry(
      async () => {
        const recaptcha = await load(config.auth.reCaptchaKey);
        const token = await recaptcha.execute(recaptchaAction);
        setRecaptchaToRequest(token);
      },
      {
        retries: 3,
        minTimeout: 100,
        maxTimeout: 200,
      },
    );
  }

  async get(url: string, params?: any) {
    const config = {
      params,
    };
    const response = await axios.get(this.getUrlPrefix() + url, config);
    return this._responseHandler(response);
  }

  async put(url: any, data?: any) {
    const response = await axios.put(this.getUrlPrefix() + url, data);
    return this._responseHandler(response);
  }

  async patch(url: any, data?: any) {
    const response = await axios.patch(this.getUrlPrefix() + url, data);
    return this._responseHandler(response);
  }

  async post(
    url: any,
    data?: any,
    recaptchaAction?: typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS],
  ) {
    if (recaptchaAction) {
      await this.getAndSetRecaptcha(recaptchaAction);
    }
    const response = await axios.post(this.getUrlPrefix() + url, data);
    return this._responseHandler(response);
  }

  async delete(url: any, data?: any) {
    const config = {
      data,
    };
    const response = await axios.delete(this.getUrlPrefix() + url, config);
    return this._responseHandler(response);
  }

  async download(url: any, data?: any) {
    const config = {
      ...data,
      responseType: 'blob',
    };
    const response = await axios.get(this.getUrlPrefix() + url, config);
    return this._responseHandler(response);
  }

  async _responseHandler(response: any) {
    return response.data;
  }
}
