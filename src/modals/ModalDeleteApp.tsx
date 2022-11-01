import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import { IAppResponse } from 'src/utils/utils-app';
import { AppInput } from 'src/components';
import AppButton from 'src/components/AppButton';

interface IModalEditApp {
  open: boolean;
  onClose: () => void;
  appInfo: IAppResponse;
}

const ModalDeleteApp: FC<IModalEditApp> = ({ open, onClose, appInfo }) => {
  const [nameApp, setNameApp] = useState<string>('');
  const history = useHistory();

  const onCloseModal = () => {
    onClose();
    setNameApp('');
  };

  const onDelete = async () => {
    try {
      await rf.getRequest('AppRequest').deleteApp(appInfo.appId);
      toastSuccess({ message: 'Delete Successfully!' });
      history.push('/');
      onCloseModal();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="xl"
      title="Delete this app ?"
      isOpen={open}
      onClose={onCloseModal}
    >
      <Box mb={6}>
        Any traffic going to deleted keys will stop working immediately. Please
        make sure that all processes using this app have been reconfigured
        before deleting.
      </Box>

      <Box mb={2}>
        If you're ready to delete this app, please type{' '}
        <Box as={'span'} color={'red'}>
          {appInfo.name}
        </Box>{' '}
        below to confirm
      </Box>

      <AppInput value={nameApp} onChange={(e) => setNameApp(e.target.value)} />

      <Flex justifyContent={'flex-end'} mt={7}>
        <Box mr={2}>
          <AppButton onClick={onCloseModal} variant="outline" fontWeight={400}>
            CANCEL
          </AppButton>
        </Box>

        <AppButton
          onClick={onDelete}
          fontWeight={400}
          variant={'red'}
          isDisabled={nameApp !== appInfo.name}
        >
          DELETE FOREVER
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalDeleteApp;
