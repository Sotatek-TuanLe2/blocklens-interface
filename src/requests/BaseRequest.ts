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

// axios.interceptors.response.use(
//   function (response) {
//     console.log(">>>>>>>>response", response);
//     return response;
//   },
//   async (error) => {
//     const { response, config } = error;
//     const status = response?.status;

//     console.log("status", status);
//     console.log("response", response.data);

//     if (
//       status === 401 &&
//       response.data?.message.toString() !== 'Credential is not correct'
//     ) {
//       const refreshToken = Storage.getRefreshToken();
//       if (!refreshToken) {
//         return AppBroadcast.dispatch('REQUEST_SIGN_IN');
//       }

//       try {
//         const response = await axios.post(
//           config.api.baseUrlApi + '/public/users/refresh-token',
//           { refreshToken },
//         );
//         store().store.dispatch(setUserAuth(response));
//         return axios(error.config);
//       } catch (error) {
//         return AppBroadcast.dispatch('REQUEST_SIGN_IN');
//       }
//     }

//     if (status === 403) {
//       return AppBroadcast.dispatch('LOGOUT_USER');
//     }

//     if (response) {
//       console.log('===errorHandler', JSON.stringify(response));
//       console.log('===errorHandler data', JSON.stringify(response.data));
//       console.log('===errorHandler status', JSON.stringify(status));
//       console.log('===errorHandler headers', JSON.stringify(response.headers));
//     } else {
//       console.log('==errorHandler', JSON.stringify(error));
//     }

//     if (status === 0 || status === 500) {
//       // Network error
//       throw new Error(COMMON_ERROR_MESSAGE);
//     }

//     if (response && response.data && response.data.message) {
//       if (typeof response.data.message === 'string') {
//         throw new Error(response.data.message);
//       }
//       throw new Error(response.data.message[0]);
//     }
//     if (response && response.data && response.data.error) {
//       throw new Error(response.data.error);
//     }

//     throw error;
//   },
// );

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
    try {
      const config = {
        params,
      };
      const response = await axios.get(this.getUrlPrefix() + url, config);
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  async put(url: any, data?: any) {
    try {
      const response = await axios.put(this.getUrlPrefix() + url, data);
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  async patch(url: any, data?: any) {
    try {
      const response = await axios.patch(this.getUrlPrefix() + url, data);
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  async post(
    url: any,
    data?: any,
    recaptchaAction?: typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS],
  ) {
    try {
      if (recaptchaAction) {
        await this.getAndSetRecaptcha(recaptchaAction);
      }
      const response = await axios.post(this.getUrlPrefix() + url, data);
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  async delete(url: any, data?: any) {
    try {
      const config = {
        data,
      };
      const response = await axios.delete(this.getUrlPrefix() + url, config);
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  async download(url: any, data?: any) {
    try {
      const config = {
        ...data,
        responseType: 'blob',
      };
      const response = await axios.get(this.getUrlPrefix() + url, config);
      return this._responseHandler(response);
    } catch (error) {
      return this._errorHandler(error);
    }
  }

  async _responseHandler(response: any) {
    return response.data;
  }

  _error403Handler() {
    return AppBroadcast.dispatch('LOGOUT_USER');
  }

  async _error401Handler(error: any) {
    const refreshToken = Storage.getRefreshToken();
    if (!refreshToken) {
      return AppBroadcast.dispatch('REQUEST_SIGN_IN');
    }

    try {
      console.log('refreshToken', refreshToken);
      const response = await axios.post(
        config.api.baseUrlApi + '/public/users/refresh-token',
        { refreshToken },
      );
      console.log('response', response);
      store().store.dispatch(setUserAuth(response.data));
      error.config.headers = {
        Authorization: 'Bearer ' + response.data.accessToken,
      };
      console.log('error.config', error.config);
      return axios(error.config);
    } catch (error) {
      return AppBroadcast.dispatch('REQUEST_SIGN_IN');
    }
  }

  async _errorHandler(err: any) {
    console.log('_errorHandler', err);
    if (
      err.response?.status === 401 &&
      err.response.data?.message.toString() !== 'Credential is not correct'
    ) {
      return this._error401Handler(err);
    }

    if (err.response?.status === 403) {
      return this._error403Handler();
    }

    if (err.response) {
      console.log('===errorHandler', JSON.stringify(err.response));
      console.log('===errorHandler data', JSON.stringify(err.response.data));
      console.log(
        '===errorHandler status',
        JSON.stringify(err.response?.status),
      );
      console.log(
        '===errorHandler headers',
        JSON.stringify(err.response.headers),
      );
    } else {
      console.log('==errorHandler', JSON.stringify(err));
    }

    if (err.response?.status === 0 || err.response?.status === 500) {
      // Network error
      throw new Error(COMMON_ERROR_MESSAGE);
    }

    if (err.response && err.response.data && err.response.data.message) {
      if (typeof err.response.data.message === 'string') {
        throw new Error(err.response.data.message);
      }
      throw new Error(err.response.data.message[0]);
    }
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
  }
}
