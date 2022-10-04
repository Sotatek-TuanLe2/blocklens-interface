import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React from 'react';
import MyPlan from './MyPlan';

const Billing = () => {
  return (
    <Box>
      <Tabs variant={'unstyled'} colorScheme="transparent">
        <TabList className="bill-tabs">
          <Flex w={'100%'}>
            <Tab className="bill-tab">My Plan</Tab>
            <Tab className="bill-tab"> Past Invoices</Tab>
          </Flex>
        </TabList>

        <TabPanels>
          <TabPanel className="tab-plan">
            <MyPlan />
          </TabPanel>
          <TabPanel>Past invoice</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Billing;
