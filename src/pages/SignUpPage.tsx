import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppLink,
  GoogleAuthButton,
} from 'src/components';
import GuestPage from 'src/layouts/GuestPage';
import ModalResendMail from 'src/modals/ModalResendMail';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/LoginPage.scss';
import { ROUTES } from 'src/utils/common';
import { setRecaptchaToRequest } from 'src/utils/utils-auth';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';

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
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [dataForm, setDataForm] = useState<IDataForm>(initDataSignUp);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [openModalResendEmail, setOpenModalResendEmail] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const onSignUp = async () => {
    try {
      if (!executeRecaptcha) {
        toastError({
          message: 'Oops. Something went wrong!',
        });
        return;
      }
      const result = await executeRecaptcha('homepage');
      setRecaptchaToRequest(result);
      const res = await rf.getRequest('AuthRequest').signUp(dataForm);
      setUserId(res?.userId || '');
      setOpenModalResendEmail(true);
    } catch (e) {
      setRecaptchaToRequest(null);
      toastError({ message: getErrorMessage(e) });
    }
  };

  const onResendMail = async () => {
    if (!userId) return;
    try {
      await rf.getRequest('AuthRequest').resendMailVerify(dataForm.email);
      toastSuccess({ message: 'Successfully!' });
    } catch (e) {
      console.error(e);
    }
  };

  const formatPass = (event) => {
    return;
  }

  const _renderFormSignUp = () => {
    return (
      <AppCard className="box-form">
        <Box className="box-form__title">Sign up</Box>
        <GoogleAuthButton>
          <Box>Sign up with Google</Box>
        </GoogleAuthButton>

        <Flex className="divider">
          <Box className="border" />
          <Box>or</Box>
          <Box className="border" />
        </Flex>

        <Box>
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField label={'First Name'} customWidth={'49%'}>
              <AppInput
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
            <AppField label={'Last Name'} customWidth={'49%'}>
              <AppInput
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
            <AppField label={'Email'}>
              <AppInput
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
                  rule: ['required', 'email', 'max:100'],
                }}
              />
            </AppField>
            <AppField label={'Password'} customWidth={'49%'}>
              <AppInput
                value={dataForm.password}
                type="password"
                placeholder={'••••••••'}
                onChange={(e) => {
                  setDataForm({
                    ...dataForm,
                    password: e.target.value
                  })
                }}
                validate={{
                  name: `password`,
                  validator: validator.current,
                  rule: ['required|min:8|max:50', 'formatPassword'],
                }}
              />
            </AppField>
            <AppField label={'Confirm Password'} customWidth={'49%'}>
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
          </Flex>

          <AppButton
            mt={3}
            onClick={onSignUp}
            size={'lg'}
            width={'full'}
            disabled={isDisableSubmit}
          >
            Sign up
          </AppButton>

          <Box mt={5} className={'note'} textAlign={'center'}>
            Already have an account? <AppLink to={ROUTES.LOGIN}>Login</AppLink>
          </Box>
        </Box>
      </AppCard>
    );
  };

  return (
    <GuestPage>
      <Flex className="box-login">
        {_renderFormSignUp()}

        <ModalResendMail
          type="Sign up"
          email={dataForm.email}
          open={openModalResendEmail}
          onClose={() => setOpenModalResendEmail(false)}
          onResend={onResendMail}
        />
      </Flex>
    </GuestPage>
  );
};

export default SignUpPage;
