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
  HashTag: string[];
  authorId: string;
}

interface IDataSettingForm {
  title: string;
  url: string;
  tag: string;
  private: boolean;
}

const ModalSettingDashboardDetails: React.FC<IModalSettingDashboardDetails> = ({
  open,
  onClose,
  url,
  HashTag,
  authorId,
}) => {
  const initDataFormSetting = {
    title: url,
    url: url,
    tag: HashTag.toString(),
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

  const checkDisableButton = !dataForm.title;

  return (
    <BaseModal isOpen={open} onClose={handleCloseModal} size="md">
      <Flex
        flexDirection={'column'}
        rowGap={'2rem'}
        className="main-modal-dashboard-details"
      >
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
        <AppField label={'Dashboard tags'}>
          <AppInput
            value={dataForm.tag}
            size="sm"
            placeholder="Tag 1, tag2, tag-3"
            onChange={(e) => {
              setDataForm({ ...dataForm, tag: e.target.value });
            }}
          />
          <Text fontSize="13px">Separate tags with commas.</Text>
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
          disabled={checkDisableButton}
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
            bg="#e1e1f9"
            color="#1e1870"
            variant={'cancel'}
          >
            Cancel
          </AppButton>
        </Flex>
      </Flex>
    </BaseModal>
  );
};

export default ModalSettingDashboardDetails;
