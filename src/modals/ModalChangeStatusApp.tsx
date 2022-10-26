import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';

interface IModalChangeStatusApp {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  appInfo: IAppResponse | null;
}

const ModalChangeStatusApp: FC<IModalChangeStatusApp> = ({
  open,
  onClose,
  appInfo,
  reloadData,
}) => {
  const history = useHistory();

  const onDelete = async () => {
    try {
      await rf.getRequest('AppRequest').toggleApp(appInfo?.appId);
      toastSuccess({ message: 'Update Successfully!' });
      history.push('/');
      onClose();
      reloadData();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const getDescription = () => {
    if (appInfo?.status === APP_STATUS.DISABLED) {
      return 'This app will become Active. You will start receiving Notify for webhooks in this app.';
    }

    return 'This app will become Inactive. You will stop receiving Notify for webhooks in this app.';
  };

  return (
    <BaseModal
      size="md"
      title={
        appInfo?.status === APP_STATUS.DISABLED
          ? 'Activate app'
          : 'Deactivate app'
      }
      isOpen={open}
      onClose={onClose}
      onActionRight={onDelete}
      onActionLeft={onClose}
      textActionRight="Confirm"
      textActionLeft="Cancel"
    >
      <Box textAlign={'center'}>{getDescription()}</Box>
    </BaseModal>
  );
};

export default ModalChangeStatusApp;
