import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { useHistory } from 'react-router';
import { IAppResponse } from 'src/utils/utils-app';
import { AppField, AppInput, AppTextarea } from 'src/components';
import AppButton from 'src/components/AppButton';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { getUserStats } from '../store/user';

interface IModalEditApp {
  open: boolean;
  onClose: () => void;
  appInfo: IAppResponse;
}

const ModalDeleteApp: FC<IModalEditApp> = ({ open, onClose, appInfo }) => {
  const [nameApp, setNameApp] = useState<string>('');
  const history = useHistory();

  const dispatch = useDispatch();

  const onCloseModal = () => {
    onClose();
    setNameApp('');
  };

  const onDelete = async () => {
    try {
      await rf.getRequest('AppRequest').deleteApp(appInfo.appId);
      toastSuccess({ message: 'Delete Successfully!' });
      dispatch(getUserStats());
      history.push('/');
      onCloseModal();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="xl"
      icon="icon-delete"
      title="Delete Confirmation"
      isOpen={open}
      description="Any traffic going to deleted keys will stop working immediately.
       Please make sure that all processes using this app has been reconfigured before deleting."
      onClose={onCloseModal}
      isFullScreen={isMobile}
    >
      <AppField
        label={'Type App Name below to confirm'}
        customWidth={'100%'}
        isRequired
      >
        <AppInput
          value={nameApp}
          onChange={(e) => setNameApp(e.target.value)}
        />
      </AppField>

      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onCloseModal}
        >
          Cancel
        </AppButton>
        <AppButton
          width={'49%'}
          size={'lg'}
          isDisabled={nameApp !== appInfo.name}
          onClick={onDelete}
        >
          Delete Forever
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalDeleteApp;
