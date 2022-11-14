import { FC, useEffect, useRef, useState } from 'react';
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
import 'src/styles/pages/LoginPage.scss';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { GoogleAuthButton } from 'src/components';

interface IDataForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: FC = () => {
  const initDataSignUp = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataSignUp);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
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

  const onSignUp = async () => {
    try {
      const res = await rf.getRequest('AuthRequest').signUp(dataForm);
      setUserId(res?.userId || '');
      toastSuccess({ message: 'Sign up successfully!' });
      setIsSuccess(true);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const onResendMail = async () => {
    if (!userId) return;
    try {
      await rf.getRequest('AuthRequest').resendMailVerify(dataForm.email);
      toastSuccess({ message: 'Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const _renderFormSignUp = () => {
    return (
      <AppCard className="box-form">
        <Box className="title">Sign up</Box>
        <GoogleAuthButton>
          <Box>Sign up with google</Box>
        </GoogleAuthButton>

        <Flex className="divider">
          <Box className="border" />
          <Box color={colorText}>or</Box>
          <Box className="border" />
        </Flex>

        <Box color={colorText}>
          <AppField label={'FIRST NAME'}>
            <AppInput
              placeholder="Gavin"
              value={dataForm.firstName}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  firstName: e.target.value,
                })
              }
              validate={{
                name: `firstName`,
                validator: validator.current,
                rule: ['required', 'max:100'],
              }}
            />
          </AppField>
          <AppField label={'LAST NAME'}>
            <AppInput
              placeholder="Belson"
              value={dataForm.lastName}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  lastName: e.target.value,
                })
              }
              validate={{
                name: `lastName`,
                validator: validator.current,
                rule: ['required', 'max:100'],
              }}
            />
          </AppField>

          <AppField label={'EMAIL'}>
            <AppInput
              value={dataForm.email}
              placeholder="gavin@sotatek.com"
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  email: e.target.value,
                })
              }
              validate={{
                name: `email`,
                validator: validator.current,
                rule: ['required', 'email'],
              }}
            />
          </AppField>

          <AppField label={'PASSWORD'}>
            <AppInput
              value={dataForm.password}
              type="password"
              placeholder={'••••••••'}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  password: e.target.value,
                })
              }
              validate={{
                name: `password`,
                validator: validator.current,
                rule: 'required|min:6|max:50',
              }}
            />
          </AppField>

          <AppField label={'CONFIRM PASSWORD'}>
            <AppInput
              type={'password'}
              placeholder={'••••••••'}
              value={dataForm.confirmPassword}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  confirmPassword: e.target.value,
                })
              }
              validate={{
                name: `confirmPassword`,
                validator: validator.current,
                rule: ['required', `isSame:${dataForm.password}`],
              }}
            />
          </AppField>

          <AppButton
            mt={5}
            onClick={onSignUp}
            size={'lg'}
            width={'full'}
            disabled={isDisableSubmit}
          >
            Sign up
          </AppButton>

          <Flex className="link-back">
            <AppLink to={'/login'} fontWeight={500}>
              Return to Login
            </AppLink>
          </Flex>
        </Box>
      </AppCard>
    );
  };

  const _renderNotificationSendMail = () => {
    return (
      <AppCard className="box-form" borderRadius={'4px'}>
        <Box textAlign={'center'}>
          An email has been sent to {dataForm.email}.<br />
          Click the link in the email to complete signup.
        </Box>
        <AppButton mt={5} onClick={onResendMail} size={'lg'} width={'full'}>
          Resend email
        </AppButton>
      </AppCard>
    );
  };

  return (
    <BasePage>
      <Flex className="box-login">
        {!isSuccess ? _renderFormSignUp() : _renderNotificationSendMail()}
      </Flex>
    </BasePage>
  );
};

export default SignUpPage;
