import { FC, useRef, useState, useEffect } from 'react';
import React from 'react';
import { Box, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppLink,
} from 'src/components';
import BasePage from 'src/layouts/BasePage';
import { createValidator } from 'src/utils/utils-validator';
import GoogleLoginButton from 'src/components/GoogleLoginButton';
import 'src/styles/pages/LoginPage.scss';

interface IDataForm {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const initDataLogin = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataLogin);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const colorText = useColorModeValue('gray.500', 'white');

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <BasePage>
      <Flex className="box-login">
        <AppCard className="box-form">
          <Box className="title">Login</Box>

          <GoogleLoginButton />

          <Flex className="divider">
            <Box className="border" />
            <Box color={colorText}>or</Box>
            <Box className="border" />
          </Flex>

          <Box color={colorText}>
            <AppField label={'EMAIL'}>
              <AppInput
                placeholder="gavin@sotatek.com"
                value={dataForm.email}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    email: e.target.value,
                  })
                }
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: 'required|email',
                }}
              />
            </AppField>

            <AppField label={'PASSWORD'}>
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
                  rule: ['required'],
                }}
              />
              <AppLink to={'/reset-password'}>Forgot your password?</AppLink>
            </AppField>

            <AppButton
              onClick={() => console.log(dataForm, 'dataForm')}
              size={'lg'}
              width={'full'}
              disabled={isDisableSubmit}
            >
              Log in
            </AppButton>

            <Box mt={2}>
              Don't have an account?
              <AppLink to={'/sign-up'} fontWeight={500}>
                Sign up
              </AppLink>
            </Box>

            <Box className="note">
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
