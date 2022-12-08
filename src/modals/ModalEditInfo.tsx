import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getInfoUser } from 'src/store/auth';

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
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();

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
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    });
  }, [userInfo]);

  const handleOnSubmit = async () => {
    if (!validators.current.allValid()) {
      validators.current.showMessages();
      return forceUpdate();
    }

    try {
      await rf.getRequest('UserRequest').editInfoUser(dataForm);
      setDataForm({ ...initialData });
      onClose();
      dispatch(getInfoUser());
      toastSuccess({ message: 'Update successfully' });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
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
      className={'modal-filter'}
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
