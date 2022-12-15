import React, { FC, ReactElement, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import rf from 'src/requests/RequestFactory';
import { setAccessToken, setUserInfo } from 'src/store/auth';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import AppButton from './AppButton';
import { Box } from '@chakra-ui/react';
import config from 'src/config';

const clientId = config.auth.googleClientId;

interface IGoogleAuthButton {
  children: ReactElement;
}

const GoogleAuthButton: FC<IGoogleAuthButton> = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const onSuccess = async (response: any) => {
    try {
      const res = await rf.getRequest('AuthRequest').loginByGoogle({
        ggAccessToken: response.accessToken,
      });

      dispatch(setAccessToken(res));
      dispatch(setUserInfo(res.user));
      toastSuccess({ message: 'Welcome to Blocksniper!' });
      history.push('/');
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const onFailure = () => {
    toastError({ message: 'Oops. Something went wrong!' });
  };

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <AppButton
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
