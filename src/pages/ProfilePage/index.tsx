import { FC, useState, useEffect } from 'react';
import React from 'react';
import BasePage from 'src/layouts/BasePage';
import { Box } from '@chakra-ui/react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from '@chakra-ui/react';
import 'src/styles/pages/ProfilePage.scss';
import MyProfile from 'src/pages/ProfilePage/parts/MyProfile';
import Billing from './parts/Billing';
import { useLocation } from 'react-router';

const TabsIndex = {
  Profile_tab: 0,
  Billing_tab: 1,
};

const ProfilePage: FC = () => {
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);
  const handleDefaultTab = () => {
    if (+location.pathname.slice(-1) === TabsIndex.Billing_tab) {
      setTabIndex(TabsIndex.Billing_tab);
    } else setTabIndex(TabsIndex.Profile_tab);
  };
  useEffect(() => {
    handleDefaultTab();
  }, [location.pathname]);
  return (
    <BasePage>
      <Flex className="profile-page">
        <Box className="profile">
          <Tabs display={'flex'} variant="soft-rounded" index={tabIndex}>
            <TabList flexDirection={'column'} className="menu-left">
              <Box className={'title'}>Settings</Box>
              <Tab
                className="tab-item"
                onClick={() => setTabIndex(TabsIndex.Profile_tab)}
              >
                My profile
              </Tab>
              <Tab
                className="tab-item"
                onClick={() => setTabIndex(TabsIndex.Billing_tab)}
              >
                Billing
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <MyProfile />
              </TabPanel>
              <TabPanel>
                <Billing />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </BasePage>
  );
};

export default ProfilePage;
