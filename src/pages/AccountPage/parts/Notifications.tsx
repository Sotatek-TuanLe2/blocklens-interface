import React, { FC, useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

const Notifications = () => {
  const [isSendMail, setIsSendMail] = useState<boolean>(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <AppCard className="box-info-account notification">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">notifications</Box>
        </Flex>

        <Flex>
          <Checkbox
            size="lg"
            isChecked={isSendMail}
            mr={3}
            onChange={() => setIsSendMail(!isSendMail)}
          />
          <Box className="value">
            Receive emails when you are at or near your daily request limit.
          </Box>
        </Flex>
        <Box className="email">Receive Email: {userInfo?.billingEmail}</Box>
      </Box>
    </AppCard>
  );
};

export default Notifications;
