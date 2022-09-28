import { Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

interface IFormChangePass {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface IChangePasswordModal {
  isOpenModal: boolean;
  setIsOpenModal: (params: any) => void;
}

const ChangePasswordModal: React.FC<IChangePasswordModal> = ({
  isOpenModal,
  setIsOpenModal,
}) => {
  const initialData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const [dataForm, setDataForm] = useState<IFormChangePass>(initialData);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const validators = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );
  const handleOnSubmit = async () => {
    const dataSubmit = {
      newPassword: dataForm.newPassword,
      oldPassword: dataForm.currentPassword,
    };
    try {
      await rf.getRequest('AuthRequest').changePassword(dataSubmit);
      setDataForm({ ...initialData });
      setIsOpenModal(false);
      toastSuccess({ message: 'Update password was successfully' });
    } catch (error: any) {
      console.log('error', error);
      if (error?.message) {
        toastError({ message: error?.message });
      }
    }
    return;
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
      isOpen={isOpenModal}
      onClose={() => setIsOpenModal(false)}
      size="2xl"
      title="Change Password"
      isHideCloseIcon
      closeOnOverlayClick
      styleHeader={{ fontSize: '24px' }}
    >
      <AppField label={'CURRENT PASSWORD'} customWidth={'100%'} isRequired>
        <AppInput
          placeholder="Current password"
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

      <AppField label={'NEW PASSWORD'} customWidth={'100%'} isRequired>
        <AppInput
          placeholder="New password"
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
            rule: 'required|min:6|max:50',
          }}
        />
      </AppField>

      <AppField label={'CONFIRM PASSWORD'} customWidth={'100%'} isRequired>
        <AppInput
          placeholder="Confirm password"
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

      <AppButton w={'100%'} disabled={isDisableSubmit} onClick={handleOnSubmit}>
        Set password
      </AppButton>
    </BaseModal>
  );
};

export default ChangePasswordModal;
