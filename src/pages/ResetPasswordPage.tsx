import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AppButton, AppCard, AppField, AppInput } from 'src/components';
import BasePage from 'src/layouts/BasePage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/LoginPage.scss';
import { setAuthorizationToRequest } from 'src/utils/utils-auth';
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
  const colorText = useColorModeValue('gray.500', 'white');

  const history = useHistory();
  const location = useLocation();
  const param: any = new URLSearchParams(location.search);
  console.log('location', param.get('id'));

  const handleSubmitResetPassword = async () => {
    if (!dataForm.confirmPassword || dataForm.newPassword) {
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
      history.replace('/login');
    } catch (error: any) {
      toastError({
        message: `${error.message || 'Oops. Something went wrong!'}`,
      });
    }
  };

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  useEffect(() => {
    if (param.get('id')) {
      setAuthorizationToRequest(param.get('id'));
    } else history.replace('/login');
  }, []);

  return (
    <BasePage>
      <Flex className="box-login">
        <AppCard className="box-form">
          <Box className="title">
            <Text pb={3}>Choose new password</Text>

            <Text color={colorText} className="sub-text">
              Enter a new password to complete password reset.
            </Text>
          </Box>

          <Box mt={5} color={colorText}>
            <AppField label={'NEW PASSWORD'}>
              <AppInput
                type={'password'}
                placeholder="********"
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
                  rule: 'required|min:6|max:50',
                }}
              />
            </AppField>

            <AppField label={'CONFIRM PASSWORD'}>
              <AppInput
                type={'password'}
                placeholder="********"
                value={dataForm.confirmPassword}
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    confirmPassword: e.target.value,
                  })
                }
                validate={{
                  name: `email`,
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
    </BasePage>
  );
};

export default ResetPasswordPage;
