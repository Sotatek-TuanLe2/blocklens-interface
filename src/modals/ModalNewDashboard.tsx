import { Checkbox, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import useUser from 'src/hooks/useUser';

interface IModalNewDashboard {
  open: boolean;
  onClose: () => void;
}

interface IDataSettingForm {
  title: string;
  url: string;
  private: boolean;
}

const ModalNewDashboard: React.FC<IModalNewDashboard> = ({ open, onClose }) => {
  const initDataFormSetting = {
    title: '',
    url: '',
    private: false,
  };
  const history = useHistory();
  const { user } = useUser();

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  const handleSubmitForm = () => {
    try {
      history.push(`/dashboard/${user?.getId()}/${dataForm.url}`);
      onClose();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleCloseModal = () => {
    onClose();
    setDataForm(initDataFormSetting);
  };

  return (
    <BaseModal isOpen={open} onClose={handleCloseModal} size="md">
      <Flex
        flexDirection={'column'}
        rowGap={'2rem'}
        className="main-modal-dashboard-details"
      >
        <AppField label={'Dashboard name'}>
          <AppInput
            value={dataForm.title}
            size="sm"
            placeholder="My dashboard"
            onChange={(e) => {
              setDataForm({
                ...dataForm,
                title: e.target.value,
              });
            }}
          />
        </AppField>
        <AppField label={'Customize the URL'}>
          <AppInput
            value={dataForm.url}
            size="sm"
            placeholder="my-dashboard"
            onChange={(e) => {
              setDataForm({ ...dataForm, url: e.target.value });
            }}
          />
        </AppField>
        <AppField label={'Privacy'}>
          <Checkbox
            isChecked={dataForm.private}
            size={'sm'}
            onChange={() => {
              setDataForm({ ...dataForm, private: !dataForm.private });
            }}
          >
            Make private
          </Checkbox>
        </AppField>
      </Flex>
      <Flex
        flexWrap={'wrap'}
        gap={'10px'}
        justifyContent={'space-between'}
        pt={'15px'}
      >
        <AppButton
          size="sm"
          bg="#1e1870"
          color="#fff"
          onClick={handleSubmitForm}
          disabled={!dataForm.title}
        >
          Save and open
        </AppButton>
        <AppButton
          onClick={handleCloseModal}
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

export default ModalNewDashboard;
