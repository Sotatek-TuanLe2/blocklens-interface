import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { Box, Flex } from '@chakra-ui/react';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import AppButton from '../components/AppButton';
import { isMobile } from 'react-device-detect';

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
      onClose();
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
      isFullScreen={isMobile}
      description="At the end of this billing period, your current plan will be terminated & changed to Free plan.
       To use our service next month after canceling subscription, you will need to manually register."
    >
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton width={'49%'} size={'lg'} onClick={cancelSubscription}>
          Confirm
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalCancelSubscription;
