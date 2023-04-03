import React, { useEffect, useRef, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import BaseModal from './BaseModal';
import 'src/styles/components/BaseModal.scss';
import { Flex, Text } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';

interface IModalForkDashBoardDetails {
  open: boolean;
  onClose: () => void;
}

interface IDataForm {
  email: string;
  password: string;
}

const ModalForkDashBoardDetails: React.FC<IModalForkDashBoardDetails> = ({
  open,
  onClose,
}) => {
  const initDataLogin = {
    email: '',
    password: '',
  };
  const [dataForm, setDataForm] = useState<IDataForm>(initDataLogin);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="error-validate">{message}</Text>
      ),
    }),
  );
  const onSave = async () => {
    try {
      console.log('ok');
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <div className="main-modal-dashboard-details">
        <AppField label={'Dashboard name'}>
          <AppInput
            size="sm"
            placeholder="My dashboard"
            value={dataForm.email}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                email: e.target.value,
              })
            }
            validate={{
              name: `dashboard `,
              validator: validator.current,
              rule: 'required|max:100',
            }}
          />
          <Text fontSize="13px">
            https://dune.com/dinhtran/{dataForm.email}
          </Text>
        </AppField>
        <AppField label={'Customize the URL'}>
          <AppInput size="sm" placeholder="my-dashboard" />
        </AppField>
      </div>
      <Flex flexWrap={'wrap'} gap={'10px'} mt={10}>
        <AppButton size="sm" bg="#1e1870" color="#fff" onClick={onSave}>
          Save and open
        </AppButton>
        <AppButton
          onClick={onClose}
          size="sm"
          bg="#e1e1f9"
          color="#1e1870"
          variant={'cancel'}
        >
          Cancel
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalForkDashBoardDetails;
