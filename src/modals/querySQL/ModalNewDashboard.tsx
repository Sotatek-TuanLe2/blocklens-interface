import { Flex, Text } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import 'src/styles/components/BaseModal.scss';
import BaseModal from '../BaseModal';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import rf from 'src/requests/RequestFactory';
import { createValidator } from 'src/utils/utils-validator';

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

  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    if (!open) {
      setDataForm(initDataFormSetting);
      validator.current.visibleFields = [];
    }
  }, [open]);

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

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

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDataForm({
                ...dataForm,
                title: e.target.value,
              })
            }
            validate={{
              name: `dashboard`,
              validator: validator.current,
              rule: ['required', 'max:150'],
            }}
          />
        </AppField>
      </Flex>
      <Flex className="modal-footer">
        <AppButton
          size="sm"
          onClick={handleSubmitForm}
          disabled={!dataForm.title.trim() || isDisableSubmit}
        >
          Save and open
        </AppButton>
        <AppButton onClick={onClose} size="sm" variant={'cancel'}>
          Cancel
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalNewDashboard;
