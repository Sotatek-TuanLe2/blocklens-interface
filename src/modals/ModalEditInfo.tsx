import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useDispatch } from 'react-redux';
import { getUserProfile } from 'src/store/user';
import useUser from 'src/hooks/useUser';
import { getErrorMessage } from '../utils/utils-helper';

interface IForm {
  lastName?: string;
  firstName?: string;
}

interface IModalEditInfo {
  open: boolean;
  onClose: () => void;
}

const ModalEditInfo: React.FC<IModalEditInfo> = ({ open, onClose }) => {
  const initialData = {
    lastName: '',
    firstName: '',
  };

  const [dataForm, setDataForm] = useState<IForm>(initialData);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const dispatch = useDispatch<any>();
  const { user } = useUser();

  const validators = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  useEffect(() => {
    setDataForm({
      ...dataForm,
      firstName: user?.getFirstName(),
      lastName: user?.getLastName(),
    });
  }, [user]);

  const handleOnSubmit = async () => {
    if (!validators.current.allValid()) {
      validators.current.showMessages();
      return forceUpdate();
    }

    try {
      await rf.getRequest('UserRequest').editInfoUser(dataForm);
      setDataForm({ ...initialData });
      onClose();
      dispatch(getUserProfile());
      toastSuccess({ message: 'Update successfully' });
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
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
      title="Edit Basic Details"
    >
      <AppField label={'First Name'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm.firstName}
          type="text"
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              firstName: e.target.value,
            });
          }}
          validate={{
            name: `firstName`,
            validator: validators.current,
            rule: 'required',
          }}
        />
      </AppField>

      <AppField label={'Last Name'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm.lastName}
          type="text"
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              lastName: e.target.value,
            });
          }}
          validate={{
            name: `lastName`,
            validator: validators.current,
            rule: 'required',
          }}
        />
      </AppField>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={10}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton
          w={'49%'}
          size="lg"
          disabled={isDisableSubmit}
          onClick={handleOnSubmit}
        >
          Save
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalEditInfo;
