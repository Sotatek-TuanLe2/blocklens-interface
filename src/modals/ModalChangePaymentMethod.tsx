import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { Box } from '@chakra-ui/react';
import rf from '../requests/RequestFactory';
import { toastError, toastSuccess } from '../utils/utils-notify';

interface IModalChangePaymentMethod {
  open: boolean;
  onClose: () => void;
  code: string;
}

const ModalChangePaymentMethod: FC<IModalChangePaymentMethod> = ({
  open,
  onClose,
  code,
}) => {
  const updatePaymentMethod = async () => {
    try {
      await rf.getRequest('BillingRequest').updateBillingPlan({ code });
      toastSuccess({ message: 'Update Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="md"
      title="Change Plan"
      isOpen={open}
      onClose={onClose}
      onActionRight={updatePaymentMethod}
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
