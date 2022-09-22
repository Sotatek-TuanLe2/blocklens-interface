import { FC } from 'react';
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
import MyProfile from './parts/MyProfile';

const ProfilePage: FC = () => {
  return (
    <BasePage>
      <Flex className="profile-page">
        <Box className="profile">
          <Tabs display={'flex'} variant="soft-rounded">
            <TabList flexDirection={'column'} className="menu-left">
              <Box className={'title'}>Settings</Box>
              <Tab className="tab-item">My profile</Tab>
              <Tab className="tab-item">Billing</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <MyProfile />
              </TabPanel>
              <TabPanel>
                <p>Team!</p>
              </TabPanel>
              <TabPanel>
                <p>Billing!</p>
              </TabPanel>
              <TabPanel>
                <p>Cost Estimator!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </BasePage>
  );
};

export default ProfilePage;
