import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton } from 'src/components';
import PlanItem from './PlanItem';

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
  return (
    <Box px={'60px'} className="plans-wrap">
      <Flex gap={'16px'}>
        {plans.map((plan: IPlan, index) => {
          return (
            <PlanItem
              plan={plan}
              key={index}
              isActive={plan.name === 'Free'}
              isSelect={isSelect}
              setIsSelect={setIsSelect}
            />
          );
        })}
      </Flex>

      <div className="stripe-wrap">
        <Text className="upgrade-plans">Card Details</Text>

        <Box className="stripe-detail">
          <div className="stripe-title">Plan</div>
          <div className="stripe-status">
            <span>Growth</span> <span className="badge-package">Monthly</span>
          </div>
          <div className="stripe-action">
            <AppButton size={'sm'}>Change</AppButton>
          </div>
        </Box>
        <Box className="stripe-detail">
          <div className="stripe-title">Subscription</div>
          <div className="stripe-price">
            <span>$49</span>
            <span>Billing at Aug 30 2022 - Sep 30 2022</span>
          </div>
          <div className="stripe-action">
            {/* <AppButton size={'sm'}>Change</AppButton> */}
          </div>
        </Box>
        <Box className="stripe-detail">
          <div className="stripe-title">Payment method</div>
          <div className="stripe-status">
            <span>
              &#8226;&#8226;&#8226;&#8226; &#8226;&#8226;&#8226;&#8226;
              &#8226;&#8226;&#8226;&#8226; 1145
            </span>
          </div>
          <div className="stripe-action">
            <AppButton size={'sm'}>Change</AppButton>
          </div>
        </Box>
        <Box className="stripe-detail">
          <div className="stripe-title">Billing email</div>
          <div className="stripe-status">dev@buni.finance</div>
          <div className="stripe-action">
            <AppButton size={'sm'}>Change</AppButton>
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default MyPlan;
