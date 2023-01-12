import { FC, useEffect, useRef, useState } from 'react';
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppLink,
} from 'src/components';
import GuestPage from 'src/layouts/GuestPage';
import { createValidator } from 'src/utils/utils-validator';
import 'src/styles/pages/LoginPage.scss';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import ModalResendMail from 'src/modals/ModalResendMail';

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

  const onResendMail = async () => {
    try {
      await rf.getRequest('AuthRequest').resendMailVerify(dataForm.email);
      toastSuccess({ message: 'Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

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

        {openModalResendEmail && (
          <ModalResendMail
            type="Reset password"
            email={dataForm.email}
            open={openModalResendEmail}
            onClose={() => setOpenModalResendEmail(false)}
            onResend={onResendMail}
          />
        )}
      </Flex>
    </GuestPage>
  );
};

export default ForgotPasswordPage;
