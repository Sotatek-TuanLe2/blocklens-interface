import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AppButton, AppCard, AppField, AppInput } from 'src/components';
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

  const history = useHistory();
  const location = useLocation();
  const param: any = new URLSearchParams(location.search);

  const handleSubmitResetPassword = async () => {
    if (!dataForm.confirmPassword || !dataForm.newPassword) {
      toastError({
        message: `${'Oops. Something went wrong!'}`,
      });
      return;
    }
    try {
      await rf.getRequest('AuthRequest').resetPassword(dataForm);
      toastSuccess({ message: 'Reset password is successfully.' });
      setAuthorizationToRequest('');
      setDataForm({ ...initDataResetPassword });
      history.replace(ROUTES.LOGIN);
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
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
  }, [dataForm]);

  useEffect(() => {
    if (param.get('id')) {
      setAuthorizationToRequest(param.get('id'));
    } else history.replace(ROUTES.LOGIN);
  }, []);

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
            <AppField label={'New Password'}>
              <AppInput
                type={'password'}
                placeholder="••••••••"
                value={dataForm.newPassword}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    newPassword: e.target.value.trim(),
                  })
                }
                validate={{
                  name: `newPassword`,
                  validator: validator.current,
                  rule: 'required|min:8|max:50',
                }}
              />
            </AppField>

            <AppField label={'Confirm Password'}>
              <AppInput
                type={'password'}
                placeholder="••••••••"
                value={dataForm.confirmPassword}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    confirmPassword: e.target.value.trim(),
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
