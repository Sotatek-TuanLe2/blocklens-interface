import { Checkbox, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';

interface IModalSettingDashboardDetails {
  open: boolean;
  onClose: () => void;
  url: string;
  authorId: string;
}

interface IDataSettingForm {
  title: string;
  url: string;
  private: boolean;
}

const ModalSettingDashboardDetails: React.FC<IModalSettingDashboardDetails> = ({
  open,
  onClose,
  url,
  authorId,
}) => {
  const initDataFormSetting = {
    title: url,
    url: url,
    private: false,
  };
  const history = useHistory();

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  const handleSubmitForm = () => {
    try {
      history.push(`/dashboard/${authorId}/${dataForm.url}`);
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
      <div className="main-modal-dashboard-details">
        <Flex flexDirection={'column'} rowGap={'2rem'}>
          <AppField label={'Dashboard title'}>
            <AppInput
              value={dataForm.title}
              size="sm"
              placeholder="my-dashboard"
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
              placeholder={url}
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
            className="btn-save"
            onClick={handleSubmitForm}
            disabled={!dataForm.title}
          >
            Save
          </AppButton>
          <Flex gap={1}>
            <AppButton
              onClick={handleCloseModal}
              size="sm"
              color="#d93025"
              variant="setup"
            >
              Archive
            </AppButton>
            <AppButton
              onClick={handleCloseModal}
              size="sm"
              className="btn-remove"
              variant={'cancel'}
            >
              Cancel
            </AppButton>
          </Flex>
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalSettingDashboardDetails;
