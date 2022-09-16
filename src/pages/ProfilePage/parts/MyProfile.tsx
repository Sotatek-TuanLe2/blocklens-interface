import { FC } from 'react';
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import 'src/styles/pages/ProfilePage.scss';
import { AppLink, AppButton } from 'src/components';

const MyProfile: FC = () => {
  return (
    <Box className="my-profile">
      <Box className="title">
        ABCD
      </Box>

      <Box className="profile-detail">
        <Flex className="info-item" borderBottom="1px solid #CACED4">
          <Flex>
            <Box className="info-title">
              Email
            </Box>
            <Box>
              anh.hoang3@sotatek.com
            </Box>
          </Flex>
          <Box>

          </Box>
        </Flex>
        <Flex className="info-item">
          <Flex>
            <Box className="info-title">
              First Name
            </Box>
            <Box>
              Mac
            </Box>
          </Flex>
          <Box>

          </Box>
        </Flex>
        <Flex className="info-item">
          <Flex>
            <Box className="info-title">
              Last Name
            </Box>
            <Box>
              Truong
            </Box>
          </Flex>
          <Box>

          </Box>
        </Flex>

        <Flex className="info-item">
          <Flex>
            <Box className="info-title">
              Role
            </Box>
            <Box>

            </Box>
          </Flex>
          <Box>

          </Box>
        </Flex>
        <Flex className="info-item">
          <Flex>
            <Box className="info-title">
              Telegram Username
            </Box>
            <Box>

            </Box>
          </Flex>
          <Box>

          </Box>
        </Flex>
        <Flex className="info-item">
          <Flex>
            <Box className="info-title">
              Discord Username
            </Box>
            <Box>

            </Box>
          </Flex>
          <Box>

          </Box>
        </Flex>
      </Box>

      <AppLink to={"#"} className="link-change-password" >Change password</AppLink>

      <Box className={'btn-sign-out'}>
        <AppButton>
          Sign out
        </AppButton>
      </Box>
    </Box>
  );
};

export default MyProfile;
