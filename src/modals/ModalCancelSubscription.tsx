import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { Box } from '@chakra-ui/react';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

interface IModalCancelSubscription {
  open: boolean;
  onClose: () => void;
}

const ModalCancelSubscription: FC<IModalCancelSubscription> = ({
  open,
  onClose,
}) => {
  const cancelSubscription = async () => {
    try {
      await rf.getRequest('BillingRequest').cancelSubscription();
      toastSuccess({ message: 'Cancel Subscription Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="lg"
      title="Cancel Subscription"
      isOpen={open}
      onClose={onClose}
      onActionRight={cancelSubscription}
      textActionRight="Confirm"
      onActionLeft={onClose}
      textActionLeft="Back"
      isHideCloseIcon
    >
      <Box maxW={'80%'} textAlign={'center'} margin={'0 auto'}>
        At the end of this billing period, your current plan will be terminated
        & changed to Free plan. To use our service next month after canceling
        subscription, you will need to manually register.
      </Box>
    </BaseModal>
  );
};

export default ModalCancelSubscription;
