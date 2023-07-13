import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { setRecaptchaToRequest } from 'src/utils/utils-auth';

type ReturnType = {
  getAndSetRecaptcha: () => Promise<void>;
  resetRecaptcha: () => void;
};

export const RECAPTCHA_ACTIONS = {
  HOMEPAGE: 'homepage',
  LOGIN: 'login',
  SOCIAL: 'social',
  E_COMMERCE: 'e-commerce',
};

const useRecaptcha = (
  action: typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS] = RECAPTCHA_ACTIONS.HOMEPAGE,
): ReturnType => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getAndSetRecaptcha = async () => {
    if (!executeRecaptcha) {
      throw new Error('Execute Recaptcha failed!');
    }

    const recaptchaToken = await executeRecaptcha(action);
    setRecaptchaToRequest(recaptchaToken);
  };

  const resetRecaptcha = () => {
    setRecaptchaToRequest(null);
  };

  return { getAndSetRecaptcha, resetRecaptcha };
};

export default useRecaptcha;
