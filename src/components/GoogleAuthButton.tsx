import React, { FC, ReactElement, useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { useDispatch } from 'react-redux';
import AppButton from './AppButton';
import { Box } from '@chakra-ui/react';
import config from 'src/config';
import { setUserAuth } from '../store/user';
import { getErrorMessage } from '../utils/utils-helper';
import useOriginPath from 'src/hooks/useOriginPath';

const clientId = config.auth.googleClientId;

interface IGoogleAuthButton {
  children: ReactElement;
}

const GoogleAuthButton: FC<IGoogleAuthButton> = ({ children }) => {
  const dispatch = useDispatch();
  const { goToOriginPath } = useOriginPath();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  useEffect(() => {
    const onLoading = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(onLoading);
  }, []);

  const onSuccess = async (response: any) => {
    try {
      const res = await rf.getRequest('AuthRequest').loginByGoogle({
        ggAccessToken: response.accessToken,
      });

      dispatch(setUserAuth(res));
      toastSuccess({ message: 'Welcome to Blocklens!' });
      goToOriginPath();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const onFailure = (error: any) => {
    if (error?.details) {
      return toastError({ message: error?.details });
    }

    toastError({ message: 'Oops. Something went wrong!' });
  };

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <AppButton
          isDisabled={isLoading}
          className="btn-login-google"
          onClick={renderProps.onClick}
          borderRadius={'6px'}
          variant={'cancel'}
          size={'lg'}
          width={'full'}
          mt={6}
          mb={3}
        >
          <Box as={'span'} className="icon-google" mr={4} /> {children}
        </AppButton>
      )}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleAuthButton;
