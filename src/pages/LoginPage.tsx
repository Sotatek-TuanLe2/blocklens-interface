import { FC, useRef, useState, useEffect } from 'react';
import React from 'react';
import { Box, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppLink,
  GoogleAuthButton,
} from 'src/components';
import BasePage from 'src/layouts/BasePage';
import { createValidator } from 'src/utils/utils-validator';
import 'src/styles/pages/LoginPage.scss';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUserInfo } from 'src/store/auth';
import { useHistory } from 'react-router';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getUserStats } from '../store/user';

interface IDataForm {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const initDataLogin = {
    email: '',
    password: '',
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const [dataForm, setDataForm] = useState<IDataForm>(initDataLogin);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const onLogin = async () => {
    try {
      const res = await rf.getRequest('AuthRequest').login(dataForm);
      if (res) {
        dispatch(setAccessToken(res));
        dispatch(setUserInfo(res.user));
        dispatch(getUserStats());
        toastSuccess({ message: 'Welcome to Blocksniper!' });
        history.push('/home');
      }
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong' });
    }
  };

  return (
    <BasePage>
      <Flex className="box-login">
        <AppCard className="box-form">
          <Box className="box-form__title">Login</Box>

          <GoogleAuthButton>
            <Box>Login with google</Box>
          </GoogleAuthButton>

          <Flex className="divider">
            <Box className="border" />
            <Box>or</Box>
            <Box className="border" />
          </Flex>

          <Box>
            <AppField label={'Email'}>
              <AppInput
                value={dataForm.email}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    email: e.target.value.trim(),
                  })
                }
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: 'required|email|max:100',
                }}
              />
            </AppField>

            <AppField label={'Password'}>
              <AppInput
                type="password"
                value={dataForm.password}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    password: e.target.value,
                  })
                }
                placeholder={'••••••••'}
                validate={{
                  name: `password`,
                  validator: validator.current,
                  rule: ['required', 'min:8', 'max:50'],
                }}
              />
              <AppLink to={'/forgot-password'}>Forgot your password?</AppLink>
            </AppField>

            <AppButton
              mt={2}
              onClick={onLogin}
              size={'lg'}
              width={'full'}
              disabled={isDisableSubmit}
            >
              Log in
            </AppButton>

            <Box mt={2} className={'note'}>
              Don't have an account? <AppLink to={'/sign-up'}>Sign up</AppLink>
            </Box>

            <Box className="note" mt={3}>
              This site is protected by reCAPTCHA and the Google{' '}
              <AppLink to={'#'}>Privacy Policy </AppLink> and{' '}
              <AppLink to={'#'}>Terms of Service</AppLink> apply.
            </Box>
          </Box>
        </AppCard>
      </Flex>
    </BasePage>
  );
};

export default LoginPage;
