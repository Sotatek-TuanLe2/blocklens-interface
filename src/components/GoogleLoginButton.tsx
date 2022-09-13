import React from 'react';
import GoogleLogin from 'react-google-login';
import AppButton from './AppButton';
const clientId =
  '895713202463-vm77jag6ov0c88ia4t2oq11bqgq1csmd.apps.googleusercontent.com';

const GoogleLoginButton = () => {
  const onSuccess = () => {
    //Todo: Handle on Success
  };

  const onFailure = () => {
    //Todo: Handle on Failure
  };

  return (
    <GoogleLogin
      clientId={clientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      //   isSignedIn={true}
      render={() => (
        <AppButton
          borderRadius={'4px'}
          variant={'outline'}
          size={'lg'}
          width={'full'}
          mt={6}
          mb={3}
        >
          Login with google
        </AppButton>
      )}
    />
  );
};

export default GoogleLoginButton;
