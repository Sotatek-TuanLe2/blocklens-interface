import React, { useEffect, useRef, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import BaseModal from './BaseModal';
import 'src/styles/components/BaseModal.scss';
import { Flex, Text } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import { useHistory } from 'react-router';

interface IModalForkDashBoardDetails {
  open: boolean;
  onClose: () => void;
  authorId: string;
}

interface IDataForkModal {
  dashboard: string;
  url: string;
}

const ModalForkDashBoardDetails: React.FC<IModalForkDashBoardDetails> = ({
  open,
  onClose,
  authorId,
}) => {
  const initDataForkModal = {
    dashboard: '',
    url: '',
  };
  const [dataForm, setDataForm] = useState<IDataForkModal>(initDataForkModal);
  const [mainUrl, setMainUrl] = useState<string>('');
  const history = useHistory();

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="error-validate">{message}</Text>
      ),
    }),
  );
  const onSave = async () => {
    try {
      history.push(`/dashboard/${authorId}/${mainUrl}`);
      onClose();
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
            value={dataForm.dashboard}
            onChange={(e) => {
              setDataForm({
                ...dataForm,
                dashboard: e.target.value,
              });
              dataForm.url.length > 0 ? null : setMainUrl(dataForm.dashboard);
            }}
            validate={{
              name: `dashboard `,
              validator: validator.current,
              rule: 'required|max:100',
            }}
          />
          <Text fontSize="13px">https://dune.com/dinhtran/{mainUrl}</Text>
        </AppField>
        <AppField label={'Customize the URL'}>
          <AppInput
            value={dataForm.url}
            onChange={(e) => {
              setDataForm({
                ...dataForm,
                url: e.target.value,
              });
              setMainUrl(dataForm.url);
            }}
            size="sm"
            placeholder={
              dataForm.dashboard.length > 0
                ? dataForm.dashboard
                : 'my-dashboard'
            }
          />
        </AppField>
      </div>
      <Flex flexWrap={'wrap'} gap={'10px'} mt={10}>
        <AppButton
          size="sm"
          bg="#1e1870"
          color="#fff"
          onClick={onSave}
          disabled={!dataForm.dashboard}
        >
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
