import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppSwitch } from 'src/components';
import PlanItem from './PlanItem';
import ModalPayment from 'src/modals/ModalPayment';

export interface IPlan {
  name: string;
  price?: string;
  features: {
    app: number | string;
    message: string;
  };
}

const plans = [
  {
    name: 'Free',
    price: '0',
    features: {
      app: 5,
      message: '3,000,000',
    },
  },
  {
    name: 'Starter',
    price: '29',
    features: {
      app: 15,
      message: '6,000,000',
    },
  },
  {
    name: 'Growth',
    price: '49',
    features: {
      app: 30,
      message: '12,000,000',
    },
  },
  {
    name: 'Enterprise',
    features: {
      app: 'Unlimited',
      message: 'Custom',
    },
  },
];

const MyPlan = () => {
  const [isSelect, setIsSelect] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isChangePlan, setIsChangePlan] = useState<boolean>(false);

  const [isOpenModalChangePaymentMethod, setIsOpenModalChangePaymentMethod] =
    useState<boolean>(false);

  const _renderPlans = (isChange?: boolean) => {
    return (
      <Flex gap={'16px'} my={5}>
        {plans.map((plan: IPlan, index) => {
          return (
            <PlanItem
              plan={plan}
              key={index}
              isActive={plan.name === 'Free'}
              isSelect={isSelect}
              setIsSelect={setIsSelect}
              isChange={isChange}
            />
          );
        })}
      </Flex>
    );
  };

  const _renderCardDetail = () => {
    return (
      <div className="stripe-wrap">
        <Text className="upgrade-plans">Card Details</Text>
        <Box className="stripe-detail">
          <div className="stripe-title">Plan</div>
          <div className="stripe-status">
            <span>Growth</span> <span className="badge-package">Monthly</span>
          </div>
          <div className="stripe-action">
            <AppButton
              variant={isChangePlan ? 'outline' : 'brand'}
              size={'sm'}
              onClick={() => setIsChangePlan(!isChangePlan)}
            >
              {isChangePlan ? 'Cancel' : 'Change'}
            </AppButton>
          </div>
        </Box>

        {isChangePlan && _renderPlans(true)}
        <Box className="stripe-detail">
          <div className="stripe-title">Subscription</div>
          <div className="stripe-price">
            <span>$49</span>
            <span>Billing at Aug 30 2022 - Sep 30 2022</span>
          </div>
        </Box>
        <Box className="stripe-detail">
          <div className="stripe-title">Payment method</div>
          <div className="stripe-status">
            <span>•••• •••• •••• 1145</span>
          </div>
          <div className="stripe-action">
            <AppButton
              size={'sm'}
              onClick={() => setIsOpenModalChangePaymentMethod(true)}
            >
              Change
            </AppButton>
          </div>
        </Box>
        <Box className="stripe-detail">
          <div className="stripe-title">Billing email</div>
          <div className="stripe-status">dev@buni.finance</div>
        </Box>
      </div>
    );
  };

  return (
    <Box px={'60px'} className="plans-wrap">
      <Flex mb={5}>
        <AppSwitch
          onChange={() => {
            setIsPaid(!isPaid);
            setIsChangePlan(false);
          }}
          isChecked={isPaid}
          mr={4}
        />
        IsPaid
      </Flex>

      {!isPaid ? _renderPlans() : _renderCardDetail()}

      <ModalPayment
        open={isOpenModalChangePaymentMethod}
        onClose={() => setIsOpenModalChangePaymentMethod(false)}
        isChangePaymentMethod
      />
    </Box>
  );
};

export default MyPlan;
