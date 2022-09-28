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
import { useHistory, useLocation, useParams } from 'react-router';

const TABS = [
  { NAME: 'profile', INDEX: 0 },
  { NAME: 'billing', INDEX: 1 },
];

const ProfilePage: FC = () => {
  const location = useLocation();
  const { tab } = useParams() as any;
  const history = useHistory();

  const [tabIndex, setTabIndex] = useState(0);

  const handleDefaultTab = () => {
    if (tab === TABS[1].NAME) {
      setTabIndex(TABS[1].INDEX);
    } else setTabIndex(TABS[0].INDEX);
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
                onClick={() => history.push('/setting/profile')}
              >
                My profile
              </Tab>
              <Tab
                className="tab-item"
                onClick={() => history.push('/setting/billing')}
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
