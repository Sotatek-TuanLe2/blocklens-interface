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
import ModalResendMail from '../modals/ModalResendMail';

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
  const [openModalResendEmail, setOpenModalResendEmail] =
    useState<boolean>(false);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const handleSendEmailResetPassword = async () => {
    if (!dataForm.email) {
      toastError({ message: 'Oops. Something went wrong!' });
      return;
    }
    try {
      await rf.getRequest('AuthRequest').forgotPassword(dataForm);
      setDataForm({ ...initDataRestPassword });
      setOpenModalResendEmail(true);
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
          <Box className="box-form__title">
            <Text pb={3}>Reset password</Text>

            <Text className="sub-text">
              Enter your account's email address and we will send you password
              reset link.
            </Text>
          </Box>

          <Box mt={5}>
            <AppField label={'Email'}>
              <AppInput
                hiddenErrorText={hiddenErrorText}
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

            <Box className="note" mt={5} textAlign={'center'}>
              Return to{' '}
              <AppLink to={'/login'} fontWeight={500}>
                Login
              </AppLink>
            </Box>
          </Box>
        </AppCard>

        <ModalResendMail
          type="Reset password"
          email={dataForm.email}
          open={openModalResendEmail}
          onClose={() => setOpenModalResendEmail(false)}
          onResend={() => console.log('send mail')}
        />
      </Flex>
    </BasePage>
  );
};

export default ForgotPasswordPage;
