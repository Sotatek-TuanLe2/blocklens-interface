import { Flex, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
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
  url: string;
}

const ModalForkDashBoardDetails: React.FC<IModalForkDashBoardDetails> = ({
  open,
  onClose,
  dashboardId,
}) => {
  const initDataForkModal = {
    dashboard: '',
    url: '',
  };
  const [dataForm, setDataForm] = useState<IDataForkModal>(initDataForkModal);
  const history = useHistory();

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
      newDashboardSlug: dataForm.url || dataForm.dashboard,
    };
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .forkDashboard(payload, dashboardId);
      if (res) {
        history.push(`/dashboards/${dataForm.url || dataForm.dashboard}`);
      }
      closeAndResetField();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };
  const linkDashboard =
    window.location.href.split('/').slice(0, -2).join('/') + '';
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
          <Text fontSize="13px">
            {linkDashboard}/{dataForm.url || dataForm.dashboard}
          </Text>
        </AppField>
        <AppField label={'Customize the URL'}>
          <AppInput
            value={dataForm.url}
            onChange={(e) => {
              setDataForm({
                ...dataForm,
                url: e.target.value,
              });
            }}
            size="sm"
            placeholder={dataForm.dashboard || 'my-dashboard'}
          />
        </AppField>

        <Flex className="modal-footer">
          <AppButton size="sm" onClick={onSave} disabled={!dataForm.dashboard}>
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
