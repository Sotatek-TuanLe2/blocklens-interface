import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { Box } from '@chakra-ui/react';

interface IModalChangePaymentMethod {
  open: boolean;
  onClose: () => void;
}

const ModalChangePaymentMethod: FC<IModalChangePaymentMethod> = ({
  open,
  onClose,
}) => {
  return (
    <BaseModal
      size="md"
      title="Change Plan"
      isOpen={open}
      onClose={onClose}
      onActionRight={onClose}
      textActionRight="Confirm"
      onActionLeft={onClose}
      textActionLeft="Cancel"
    >
      <Box maxW={'80%'} textAlign={'center'} margin={'0 auto'}>
        Your current plan will be terminated (previous payment is not refund).
        New plan will be applied with billing period starting today. Continue?
      </Box>
    </BaseModal>
  );
};

export default ModalChangePaymentMethod;
