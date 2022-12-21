import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import AppButton from 'src/components/AppButton';

interface ModalUpgradeCreateApp {
  open: boolean;
  onClose: () => void;
  onResend: () => void;
  type: 'Sign up' | 'Reset password';
  email: string;
}

const ModalResendMail: FC<ModalUpgradeCreateApp> = ({
  open,
  onClose,
  type,
  email,
  onResend,
}) => {
  const renderDescription = () => {
    if (type === 'Sign up') {
      return (
        <Box className={'modal__description-email'}>
          An emails has been sent to <span className="email">{email}</span>{' '}
          <br />
          Click the link in the email to complete signup.
        </Box>
      );
    }

    return (
      <Box className={'modal__description-email'}>
        An emails has been sent to <span className="email">{email}</span> <br />
        Click the link in the email to choose a new password.
      </Box>
    );
  };

  return (
    <BaseModal size="xl" icon="icon-sent-mail" isOpen={open} onClose={onClose}>
      <Box mt={7}>{renderDescription()}</Box>

      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        <AppButton size={'lg'} onClick={onResend}>
          Resend Email
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalResendMail;
