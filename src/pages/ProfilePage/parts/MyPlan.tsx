import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppCard } from 'src/components';
import PlanItem from './PlanItem';

const MyPlan = () => {
  return (
    <Box paddingX={'60px'} className="plans-wrap">
      <Text className="upgrade-plans">Upgrade Plan</Text>
      <Flex gap={'16px'}>
        <PlanItem />
        <PlanItem />
        <AppCard className="plan-item-container ">
          <div className="status-plan">
            <div className="icon-done"></div>
            {/* <div className="next-plan">
          <div className="icon-lock"></div>
          <span>ADD PAYMENT INFO TO UNLOCK!</span>
        </div> */}
          </div>

          <Box className="plan-item">
            <Box className="plan-item-desc">
              <Text>FREE FOREVER</Text>
              <span className="price-plan">
                0<span className="currency">$</span>
              </span>
            </Box>
            <Text className="price-per-month">300,000,000 CU / month</Text>
            <div>
              <span className="allow-title">Free access to:</span>
              <br />
              <Text paddingX={'20px'} className="allow-list">
                Supernode, Build, <br />
                Monitor, and Notify <br /> Enhanced APIs <br /> Full Archive
                Data
                <br /> 5 Apps
              </Text>
            </div>
          </Box>
        </AppCard>
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
