import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import AppButton from 'src/components/AppButton';
import { AppBroadcast } from 'src/utils/utils-broadcast';

interface IModalSignInRequest {
  open: boolean;
  onClose: () => void;
}

const ModalSignInRequest: FC<IModalSignInRequest> = ({ open, onClose }) => {
  const onCloseModal = () => {
    onClose();
  };

  const onLogin = async () => {
    AppBroadcast.dispatch('LOGOUT_USER');
    onClose();
  };

  return (
    <BaseModal
      size="xl"
      title="Sign In Request"
      isOpen={open}
      isHideCloseIcon
      description="The work session has expired. Please sign-in again!"
      onClose={onCloseModal}
    >
      <Flex flexWrap={'wrap'} justifyContent={'center'} mt={2}>
        <AppButton size={'lg'} onClick={onLogin}>
          Sign In
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalSignInRequest;
