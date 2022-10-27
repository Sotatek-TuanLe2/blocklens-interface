import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import { IAppResponse } from '../utils/utils-app';

interface IModalEditApp {
  open: boolean;
  onClose: () => void;
  appInfo: IAppResponse;
}

const ModalDeleteApp: FC<IModalEditApp> = ({ open, onClose, appInfo }) => {
  const history = useHistory();
  const onDelete = async () => {
    try {
      await rf.getRequest('AppRequest').deleteApp(appInfo.appId);
      toastSuccess({ message: 'Edit Successfully!' });
      history.push('/');
      onClose();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="md"
      title="Delete this app ?"
      isOpen={open}
      onClose={onClose}
      onActionRight={onDelete}
      onActionLeft={onClose}
      textActionRight="Delete"
      textActionLeft="Cancel"
    >
      <Box>
        Are you sure you want to delete <b>{appInfo.name}</b> ?
      </Box>
    </BaseModal>
  );
};

export default ModalDeleteApp;
