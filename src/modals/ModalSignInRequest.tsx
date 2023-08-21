import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import AppButton from 'src/components/AppButton';
import { useDispatch } from 'react-redux';
import { clearUser } from 'src/store/user';
import { ROUTES } from 'src/utils/common';
import { useHistory } from 'react-router-dom';

interface IModalSignInRequest {
  open: boolean;
  onClose: () => void;
}

const ModalSignInRequest: FC<IModalSignInRequest> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onCloseModal = () => {
    onClose();
  };

  const onLogin = async () => {
    onClose();
    dispatch(clearUser());
    history.push(ROUTES.LOGIN);
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
