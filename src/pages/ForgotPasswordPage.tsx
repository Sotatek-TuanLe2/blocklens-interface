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

interface IDataForm {
  email: string;
}

const ForgotPasswordPage: FC = () => {
  const initDataRestPassword = {
    email: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataRestPassword);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [hiddenErrorText, setHiddenErrorText] = useState(false);
  const colorText = useColorModeValue('gray.500', 'white');

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  const handleSendEmailResetPassword = async () => {
    if (!dataForm.email) {
      toastError({ message: 'Oops. Something went wrong!' });
      return;
    }
    try {
      await rf.getRequest('AuthRequest').forgotPassword(dataForm);
      toastSuccess({ message: 'Send mail is successfully.' });
      setDataForm({ ...initDataRestPassword });
      setHiddenErrorText(true);
    } catch (error: any) {
      toastError({
        message: `${error.message || 'Oops. Something went wrong!'}`,
      });
    }
  };
  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <BasePage>
      <Flex className="box-login">
        <AppCard className="box-form">
          <Box className="title">
            <Text pb={3}>Reset password</Text>

            <Text color={colorText} className="sub-text">
              Enter your account's email address and we will send you password
              reset link.
            </Text>
          </Box>

          <Box mt={5} color={colorText}>
            <AppField label={'EMAIL'}>
              <AppInput
                hiddenErrorText={hiddenErrorText}
                placeholder="gavin@sotatek.com"
                value={dataForm.email}
                onChange={(e) => {
                  setHiddenErrorText(false);

                  setDataForm({
                    ...dataForm,
                    email: e.target.value,
                  });
                }}
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: 'required|email',
                }}
              />
            </AppField>

            <AppButton
              onClick={handleSendEmailResetPassword}
              size={'lg'}
              width={'full'}
              mt={3}
              disabled={isDisableSubmit}
            >
              Send reset email
            </AppButton>

            <Flex className="link-back">
              <AppLink to={'/login'} fontWeight={500}>
                Return to Login
              </AppLink>
            </Flex>
          </Box>
        </AppCard>
      </Flex>
    </BasePage>
  );
};

export default ForgotPasswordPage;