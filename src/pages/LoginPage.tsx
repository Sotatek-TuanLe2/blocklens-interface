import { FC, useRef, useState, useEffect } from 'react';
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppLink,
  GoogleAuthButton,
} from 'src/components';
import GuestPage from 'src/layouts/GuestPage';
import { createValidator } from 'src/utils/utils-validator';
import 'src/styles/pages/LoginPage.scss';
import { useDispatch } from 'react-redux';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { setUserAuth } from '../store/user';
import { ROUTES } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';
import useOriginPath from 'src/hooks/useOriginPath';
import { setRecaptchaToRequest } from 'src/utils/utils-auth';

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
  const { goToOriginPath } = useOriginPath();

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
        dispatch(setUserAuth(res));
        toastSuccess({ message: 'Welcome to Blocklens!' });
        goToOriginPath();
      }
    } catch (e) {
      setRecaptchaToRequest(null);
      toastError({ message: getErrorMessage(e) });
    }
  };

  return (
    <GuestPage>
      <Flex className="box-login">
        <AppCard className="box-form">
          <Box className="box-form__title">Login</Box>

          <GoogleAuthButton>
            <Box className="google-login">Signin with Google</Box>
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
              <AppLink to={ROUTES.FORGOT_PASSWORD}>
                Forgot your password?
              </AppLink>
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
              Don't have an account?{' '}
              <AppLink to={ROUTES.SIGN_UP}>Sign up</AppLink>
            </Box>

            <Box className="note" mt={3}>
              This site is protected by reCAPTCHA and the{' '}
              <a
                href="https://policies.google.com/privacy"
                className={'link'}
                target="_blank"
              >
                Privacy Policy{' '}
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                className={'link'}
              >
                Terms of Service
              </a>{' '}
              apply.
            </Box>
          </Box>
        </AppCard>
      </Flex>
    </GuestPage>
  );
};

export default LoginPage;
