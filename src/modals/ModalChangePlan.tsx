import React, { FC } from 'react';
import BaseModal from './BaseModal';
import { Box, Flex, Text } from '@chakra-ui/react';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from '../utils/utils-notify';
import 'src/styles/pages/ProfilePage.scss';
import { AppCard } from 'src/components';
import { getMyPlan, IPlan } from 'src/store/billing';
import { useDispatch } from 'react-redux';

interface IModalChangePaymentMethod {
  open: boolean;
  onClose: () => void;
  isUpgrade: boolean;
  plan: IPlan;
}

const ModalChangePlan: FC<IModalChangePaymentMethod> = ({
  open,
  onClose,
  isUpgrade,
  plan,
}) => {
  const dispatch = useDispatch<any>();

  const changePlan = async () => {
    try {
      await rf
        .getRequest('BillingRequest')
        .updateBillingPlan({ code: plan.code });
      toastSuccess({ message: 'Update Successfully!' });
      dispatch(getMyPlan());
      onClose();
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
        <Box w={'38%'}>
          <AppCard p={0} pt={4} border={'1px solid #a246cd'}>
            <Box className="plan-item">
              <Box className="plan-item-desc">
                <Text textTransform="uppercase">{plan.name}</Text>
                <>
                  <Flex className="price-plan">
                    <Text className="currency">$</Text>
                    {plan?.price}
                    {plan?.price && +plan?.price > 0 && (
                      <Text className="time">/mo</Text>
                    )}
                  </Flex>
                </>
              </Box>
              <div>
                <Box className="allow-title">{plan.description}</Box>
              </div>
            </Box>
          </AppCard>
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
