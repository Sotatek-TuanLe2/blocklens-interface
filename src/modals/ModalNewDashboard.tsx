import { Flex } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
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

  const [error, setError] = useState<boolean>(false);

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
    setError(false);
  };

  // const defaultSlug = useMemo(() => {
  //   if (dataForm.title) {
  //     return dataForm.title.trim().replaceAll(" ", "-");
  //   }
  //   return "my-dashboard";
  // }, [dataForm.title]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 150) {
      setError(true);
    } else {
      setError(false);
    }
    setDataForm({
      ...dataForm,
      title: value,
    });
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e)}
            error={error}
          />
          {error && (
            <div className="input-error">
              Value too long for type character varying(150)
            </div>
          )}
        </AppField>
      </Flex>
      <Flex className="modal-footer">
        <AppButton
          size="sm"
          onClick={handleSubmitForm}
          disabled={!dataForm.title.trim() || error}
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
