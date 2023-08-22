import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppLink,
} from 'src/components';
import { COMMON_ERROR_MESSAGE } from 'src/constants';
import GuestPage from 'src/layouts/GuestPage';
import ModalResendMail from 'src/modals/ModalResendMail';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/LoginPage.scss';
import { ROUTES } from 'src/utils/common';
import { setRecaptchaToRequest } from 'src/utils/utils-auth';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';

interface IDataForm {
  email: string;
}

const ForgotPasswordPage: FC = () => {
  const initDataRestPassword = {
    email: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataRestPassword);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [openModalResendEmail, setOpenModalResendEmail] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      setOpenModalResendEmail(true);
    } catch (error: any) {
      setRecaptchaToRequest(null);
      const errorMessage = getErrorMessage(error);
      if (errorMessage !== COMMON_ERROR_MESSAGE) {
        setErrorMessage(errorMessage);
      } else {
        toastError({ message: errorMessage });
      }
    }
  };

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
    if (errorMessage) {
      validator.current.showMessages();
    }
  }, [dataForm, errorMessage]);

  return (
    <GuestPage>
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
            <AppField label={'Email'} isRequired>
              <AppInput
                value={dataForm.email}
                onChange={(e) => {
                  setErrorMessage('');
                  setDataForm({
                    ...dataForm,
                    email: e.target.value,
                  });
                }}
                validate={{
                  name: `email`,
                  validator: validator.current,
                  rule: [
                    'required',
                    'email',
                    `hasErrorMessage:${errorMessage}`,
                  ],
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
              <AppLink to={ROUTES.LOGIN} fontWeight={500}>
                Login
              </AppLink>
            </Box>
          </Box>
        </AppCard>

        {openModalResendEmail && (
          <ModalResendMail
            type="Reset password"
            email={dataForm.email}
            open={openModalResendEmail}
            onClose={() => setOpenModalResendEmail(false)}
            onResend={handleSendEmailResetPassword}
          />
        )}
      </Flex>
    </GuestPage>
  );
};

export default ForgotPasswordPage;
