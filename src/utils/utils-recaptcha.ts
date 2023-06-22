import axios from 'axios';

export const setRecaptchaToRequest = (recaptcha: string | null) => {
  if (!recaptcha) {
    return delete axios.defaults.headers.common['recaptcha'];
  }
  axios.defaults.headers.common['recaptcha'] = recaptcha;
};
