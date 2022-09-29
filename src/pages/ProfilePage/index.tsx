import { FC } from 'react';
import React from 'react';
import { BasePageContainer } from 'src/layouts';
import { Box } from '@chakra-ui/react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import 'src/styles/pages/ProfilePage.scss';
import MyProfile from 'src/pages/ProfilePage/parts/MyProfile';

const ProfilePage: FC = () => {
  return (
    <BasePageContainer>
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
              <p>Billing!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </BasePageContainer>
  );
};

export default ProfilePage;
