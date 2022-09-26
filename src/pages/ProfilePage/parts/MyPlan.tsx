import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppButton, AppCard } from 'src/components';
import PlanItem from './PlanItem';

// const ButtonChange = () => {
//   const [changeStatus, setChangeStatus] = useState<boolean>(false);
//   if (!changeStatus)
//     return (
//       <AppButton size={'sm'} onClick={() => setChangeStatus(!changeStatus)}>
//         Change
//       </AppButton>
//     );
//   else return <AppButton size={'sm'}>Submit</AppButton>;
// };

const MyPlan = () => {
  return (
    <Box paddingX={'60px'} className="plans-wrap">
      <Text className="upgrade-plans">Upgrade Plan</Text>
      <Flex gap={'16px'}>
        <PlanItem />
        <PlanItem />
        <PlanItem />
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
