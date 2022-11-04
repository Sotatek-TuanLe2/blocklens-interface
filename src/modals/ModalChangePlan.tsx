import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { Box, Flex } from '@chakra-ui/react';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from '../utils/utils-notify';
import { IBillingPlan } from 'src/pages/ProfilePage/parts/MyPlan';
import PlanItem from 'src/pages/ProfilePage/parts/PlanItem';
import 'src/styles/pages/ProfilePage.scss';

interface IModalChangePaymentMethod {
  open: boolean;
  onClose: () => void;
  isUpgrade: boolean;
  plan: IBillingPlan;
}

const ModalChangePlan: FC<IModalChangePaymentMethod> = ({
  open,
  onClose,
  isUpgrade,
  plan,
}) => {
  const changePlan = async () => {
    try {
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: plan.code });
      toastSuccess({ message: 'Update Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const _renderDescriptionDowngrade = () => {
    return (
      <Box>
        - Your current plan would still be usable until the end of the current
        billing period. <br />
        - New plan will be applied with the next billing period. <br />- Some
        apps might become inactive to match limit of the Downgraded plan
        (changable later).
      </Box>
    );
  };

  const _renderDescriptionUpgrade = () => {
    return (
      <Box>
        - Your current plan will be terminated.
        <br />- New plan will be applied with billing period starting today.
      </Box>
    );
  };

  return (
    <BaseModal
      size="2xl"
      title={isUpgrade ? 'Upgrade' : 'Downgrade'}
      isOpen={open}
      onClose={onClose}
      onActionRight={changePlan}
      textActionRight="Confirm"
      onActionLeft={onClose}
      textActionLeft="Cancel"
      isHideCloseIcon
    >
      <Flex>
        <Box w={'45%'}>
          <PlanItem plan={plan} isSelect={plan.name} />
        </Box>
        <Box w={'65%'} ml={10}>
          {isUpgrade
            ? _renderDescriptionUpgrade()
            : _renderDescriptionDowngrade()}
        </Box>
      </Flex>
    </BaseModal>
  );
};

export default ModalChangePlan;