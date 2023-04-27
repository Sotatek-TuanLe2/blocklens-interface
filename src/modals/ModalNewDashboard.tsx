import { Checkbox, Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from './BaseModal';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import rf from 'src/requests/RequestFactory';

interface IModalNewDashboard {
  open: boolean;
  onClose: () => void;
}

interface IDataSettingForm {
  title: string;
}

const ModalNewDashboard: React.FC<IModalNewDashboard> = ({ open, onClose }) => {
  const initDataFormSetting = {
    title: '',
  };
  const history = useHistory();

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  const handleSubmitForm = async () => {
    try {
      const result = await rf
        .getRequest('DashboardsRequest')
        .createNewDashboard({
          name: dataForm.title.trim(),
        });
      history.push(`/dashboards/${result.id}`);
      onClose();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    }
  };

  const handleCloseModal = () => {
    onClose();
    setDataForm(initDataFormSetting);
  };

  // const defaultSlug = useMemo(() => {
  //   if (dataForm.title) {
  //     return dataForm.title.trim().replaceAll(" ", "-");
  //   }
  //   return "my-dashboard";
  // }, [dataForm.title]);

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
      </Flex>
      <Flex className="modal-footer">
        <AppButton
          size="sm"
          onClick={handleSubmitForm}
          disabled={!dataForm.title.trim()}
        >
          Save and open
        </AppButton>
        <AppButton onClick={handleCloseModal} size="sm" variant={'cancel'}>
          Cancel
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalNewDashboard;
