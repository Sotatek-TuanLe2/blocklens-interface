import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { IDashboardDetail } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from '../BaseModal';

interface IModalSettingDashboardDetails {
  open: boolean;
  onClose: () => void;
  dataDashboard?: IDashboardDetail;
  onReload: () => Promise<void>;
}

interface IDataSettingForm {
  title?: string;
}

const ModalSettingDashboardDetails: React.FC<IModalSettingDashboardDetails> = ({
  open,
  onClose,
  dataDashboard,
  onReload,
}) => {
  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const initDataFormSetting = {
    title: dataDashboard?.name,
  };

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  useEffect(() => {
    if (!open) {
      setDataForm(initDataFormSetting);
    }
  }, [open]);

  useEffect(() => {
    setDataForm({
      title: dataDashboard?.name,
    });
  }, [dataDashboard?.name]);

  const handleSubmitForm = async () => {
    try {
      const payload = {
        name: dataForm.title,
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem(payload, dataDashboard?.id);
      if (res) {
        toastSuccess({ message: 'Update was successful.' });
        onClose();
        onReload();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  return (
    <BaseModal isOpen={open} onClose={onClose} size="md">
      <div className="main-modal-dashboard-details">
        <Flex flexDirection={'column'} rowGap={'2rem'}>
          <AppField label={'Dashboard title'}>
            <AppInput
              value={dataForm.title}
              size="sm"
              placeholder="my-dashboard"
              defaultValue={dataDashboard?.name}
              onChange={(e) => {
                setDataForm({
                  ...dataForm,
                  title: e.target.value,
                });
              }}
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
            disabled={!dataForm.title}
          >
            Save
          </AppButton>
          <Flex gap={1}>
            <AppButton onClick={onClose} size="sm" variant={'cancel'}>
              Cancel
            </AppButton>
          </Flex>
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalSettingDashboardDetails;
