import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import Storage from 'src/utils/storage';

interface IFormChangePass {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface IChangePasswordModal {
  open: boolean;
  onClose: () => void;
}

const ModalChangePassword: React.FC<IChangePasswordModal> = ({
  open,
  onClose,
}) => {
  const initialData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const [dataForm, setDataForm] = useState<IFormChangePass>(initialData);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const history = useHistory();
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const validators = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );
  const handleOnSubmit = async () => {
    if (!validators.current.allValid()) {
      validators.current.showMessages();
      return forceUpdate();
    }
    const dataSubmit = {
      newPassword: dataForm.newPassword,
      oldPassword: dataForm.currentPassword,
    };
    try {
      await rf.getRequest('AuthRequest').changePassword(dataSubmit);
      setDataForm({ ...initialData });
      onClose();
      toastSuccess({ message: 'Update password was successfully' });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  };
  const handleClickForgotPassword = () => {
    Storage.logout();
    history.push('/forgot-password');
  };

  useEffect(() => {
    const statusSubmitBtn = setTimeout(() => {
      const isDisable = !validators.current.allValid();
      setIsDisableSubmit(isDisable);
    }, 0);
    return () => clearTimeout(statusSubmitBtn);
  }, [dataForm]);

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="md"
      className={'modal-filter'}
      title="Change Password"
    >
      <AppField label={'Current Password'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm.currentPassword}
          type="password"
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              currentPassword: e.target.value,
            });
          }}
          validate={{
            name: `currentPassword`,
            validator: validators.current,
            rule: ['required'],
          }}
        />
      </AppField>

      <AppField label={'New Password'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm.newPassword}
          type="password"
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              newPassword: e.target.value,
            });
          }}
          validate={{
            name: `newPassword`,
            validator: validators.current,
            rule: 'required|min:8|max:50|formatPassword',
          }}
        />
      </AppField>

      <AppField label={'Confirm password'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm.confirmPassword}
          type="password"
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              confirmPassword: e.target.value,
            });
          }}
          validate={{
            name: `confirmPassword`,
            validator: validators.current,
            rule: ['required', `isSame:${dataForm.newPassword}`],
          }}
        />
      </AppField>
      <Box onClick={handleClickForgotPassword} mb={7} mt={-3} className="link">
        Forgot your password?
      </Box>
      <AppButton
        w={'100%'}
        size="lg"
        disabled={isDisableSubmit}
        onClick={handleOnSubmit}
      >
        Set password
      </AppButton>
    </BaseModal>
  );
};

export default ModalChangePassword;
