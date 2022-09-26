import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { AppCard } from 'src/components';

const PlanItem = () => {
  return (
    <AppCard className="plan-item-container plan-container-bought">
      <div className="status-plan">
        {/* <div className="icon-done"></div> */}
        <div className="next-plan">
          <div className="icon-lock"></div>
          <span>ADD PAYMENT INFO TO UNLOCK!</span>
        </div>
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
            Monitor, and Notify <br /> Enhanced APIs <br /> Full Archive Data
            <br /> 5 Apps
          </Text>
        </div>
      </Box>
    </AppCard>
  );
};

export default PlanItem;
