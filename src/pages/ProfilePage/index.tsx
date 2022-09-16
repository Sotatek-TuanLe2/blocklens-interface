import { FC } from 'react';
import React from 'react';
import BasePage from '../../layouts/BasePage';
import { Box } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import 'src/styles/pages/ProfilePage.scss';
import MyProfile from './parts/MyProfile';

const ProfilePage: FC = () => {
  return (
    <BasePage>
      <Box className="profile">
        <Tabs display={'flex'} variant="soft-rounded">
          <TabList flexDirection={'column'} className="menu-left">
            <Box className={'title'}>Settings</Box>
            <Tab className="tab-item">My profile</Tab>
            <Tab className="tab-item">Team</Tab>
            <Tab className="tab-item">Billing</Tab>
            <Tab className="tab-item">Cost Estimator</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <MyProfile />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </BasePage>
  );
};

export default ProfilePage;
