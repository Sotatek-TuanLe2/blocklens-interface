import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import AppButton from 'src/components/AppButton';

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
  const onChangeStatus = async () => {
    try {
      await rf.getRequest('AppRequest').toggleApp(appInfo?.appId);
      toastSuccess({ message: 'Update Successfully!' });
      onClose();
      reloadData();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const getDescription = () => {
    if (appInfo?.status === APP_STATUS.DISABLED) {
      return (
        <div>
          This app will become Active. You will start receiving <br /> notify
          for webhooks in this app
        </div>
      );
    }

    return (
      <div>
        This app will become Inactive. You will stop receiving <br /> notify for
        webhooks in this app.
      </div>
    );
  };

  return (
    <BaseModal
      size="lg"
      title={
        appInfo?.status === APP_STATUS.DISABLED
          ? 'Activate app'
          : 'Deactivate app'
      }
      isOpen={open}
      onClose={onClose}
    >
      <Box textAlign={'center'}>{getDescription()}</Box>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={10}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton width={'49%'} size={'lg'} onClick={onChangeStatus}>
          Confirm
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalChangeStatusApp;
