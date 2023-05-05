import { Flex, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { AppButton, AppField, AppInput } from 'src/components';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from './BaseModal';

interface IModalForkDashBoardDetails {
  open: boolean;
  onClose: () => void;
  dashboardId: string;
}

interface IDataForkModal {
  dashboard: string;
}

const ModalForkDashBoardDetails: React.FC<IModalForkDashBoardDetails> = ({
  open,
  onClose,
  dashboardId,
}) => {
  const initDataForkModal = {
    dashboard: '',
  };
  const [dataForm, setDataForm] = useState<IDataForkModal>(initDataForkModal);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="error-validate">{message}</Text>
      ),
    }),
  );

  const closeAndResetField = () => {
    onClose();
    setDataForm(initDataForkModal);
  };

  const onSave = async () => {
    const payload = {
      newDashboardName: dataForm.dashboard,
    };
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .forkDashboard(payload, dashboardId);
      if (res) {
        window.location.replace(`/dashboards/${res.id}`);
      }
      closeAndResetField();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  return (
    <BaseModal isOpen={open} onClose={closeAndResetField} size="md">
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
            }}
            validate={{
              name: `dashboard `,
              validator: validator.current,
              rule: 'required|max:100',
            }}
          />
        </AppField>

        <Flex className="modal-footer">
          <AppButton
            size="sm"
            onClick={onSave}
            disabled={!dataForm.dashboard || dataForm.dashboard.length > 100}
          >
            Save and open
          </AppButton>
          <AppButton
            onClick={() => closeAndResetField()}
            size="sm"
            variant={'cancel'}
          >
            Cancel
          </AppButton>
        </Flex>
      </div>
    </BaseModal>
  );
};

export default ModalForkDashBoardDetails;
