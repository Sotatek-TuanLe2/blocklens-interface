import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import AppButton from 'src/components/AppButton';

export enum SendMailType {
  SING_UP,
  RESET_PASS,
}

interface ModalUpgradeCreateApp {
  open: boolean;
  onClose: () => void;
  onResend: () => void;
  type: SendMailType;
  email: string;
}

const ModalResendMail: FC<ModalUpgradeCreateApp> = ({
  open,
  onClose,
  type,
  email,
  onResend,
}) => {
  const SignUpComp = (
    <Box className={'modal__description-email'}>
      Check your email <span className="email">{email}</span> for the
      verification link to complete sign up.
    </Box>
  );

  const ResetPassComp = (
    <Box className={'modal__description-email'}>
      Check your email <span className="email">{email}</span> for the link to
      set up new password.
    </Box>
  );

  return (
    <BaseModal size="xl" icon="icon-sent-mail" isOpen={open} onClose={onClose}>
      <Box mt={7}>
        <Text
          display={{ base: 'none', lg: 'block' }}
          className="modal__title-send-mail"
          as={'h2'}
        >
          One last step!
        </Text>
        <Box className={'modal__description-email'}>
          {type === SendMailType.SING_UP ? SignUpComp : ResetPassComp}
          <Flex justify={'center'}>
            Didn’t receive it?
            <Text
              ml={1}
              textColor={'#1979FF'}
              cursor={'pointer'}
              _hover={{ textDecor: 'underline' }}
              onClick={onResend}
            >
              Resend
            </Text>
          </Flex>
        </Box>
      </Box>

      <Flex flexWrap={'wrap'} justifyContent={'center'} pt={4}>
        <AppButton size={'lg'} onClick={onClose} showSubmitting>
          Finish
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalResendMail;
