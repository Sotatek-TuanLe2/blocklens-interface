import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AppButton, AppCard, AppField, AppInput } from 'src/components';
import { COMMON_ERROR_MESSAGE } from 'src/constants';
import GuestPage from 'src/layouts/GuestPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/LoginPage.scss';
import { ROUTES } from 'src/utils/common';
import { setAuthorizationToRequest } from 'src/utils/utils-auth';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';

interface IDataForm {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: FC = () => {
  const initDataResetPassword = {
    newPassword: '',
    confirmPassword: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataResetPassword);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const history = useHistory();
  const location = useLocation();
  const param: any = new URLSearchParams(location.search);

  useEffect(() => {
    if (param.get('token')) {
      setAuthorizationToRequest(param.get('token'));
    } else history.replace(ROUTES.LOGIN);
  }, [param]);

  const handleSubmitResetPassword = async () => {
    if (!dataForm.confirmPassword || !dataForm.newPassword) {
      toastError({
        message: 'Oops. Something went wrong!',
      });
      return;
    }

    try {
      const res = await rf.getRequest('AuthRequest').resetPassword({
        newPassword: dataForm.newPassword,
        resetToken: param.get('token'),
      });
      if (res?.message === 'OK') {
        toastSuccess({ message: 'Reset password is successfully.' });
        setAuthorizationToRequest('');
        setDataForm({ ...initDataResetPassword });
        history.replace(ROUTES.LOGIN);
        return;
      }

      if (!res) {
        toastError({
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (errorMessage !== COMMON_ERROR_MESSAGE) {
        setErrorMessage(errorMessage);
      } else {
        toastError({ message: errorMessage });
      }
    }
  };

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

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
            <Text pb={3}>Choose new password</Text>

            <Text className="sub-text">
              Enter a new password to complete password reset.
            </Text>
          </Box>

          <Box mt={5}>
            <AppField label={'New Password'} isRequired>
              <AppInput
                type={'password'}
                value={dataForm.newPassword}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    newPassword: e.target.value,
                  })
                }
                validate={{
                  name: `newPassword`,
                  validator: validator.current,
                  rule: [
                    'required',
                    'min:8',
                    'max:50',
                    `hasErrorMessage:${errorMessage}`,
                  ],
                }}
              />
            </AppField>

            <AppField label={'Confirm Password'} isRequired>
              <AppInput
                type={'password'}
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
                  rule: ['required', `isSame:${dataForm.newPassword}`],
                }}
              />
            </AppField>

            <AppButton
              onClick={handleSubmitResetPassword}
              size={'lg'}
              width={'full'}
              mt={3}
              disabled={isDisableSubmit}
            >
              Set password
            </AppButton>
          </Box>
        </AppCard>
      </Flex>
    </GuestPage>
  );
};

export default ResetPasswordPage;
