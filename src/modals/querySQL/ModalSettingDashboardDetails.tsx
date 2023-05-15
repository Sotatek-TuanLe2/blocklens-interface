import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { IDashboardDetail } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
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
  const initDataFormSetting = {
    title: dataDashboard?.name,
  };

  const [dataForm, setDataForm] =
    useState<IDataSettingForm>(initDataFormSetting);

  const handleSubmitForm = async () => {
    try {
      const payload = {
        name: dataForm.title,
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem(payload, dataDashboard?.id);
      if (res) {
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
