import React, { FC, useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Checkbox, Flex } from '@chakra-ui/react';

interface INotifications {
  billingInfo: any;
}

const Notifications: FC<INotifications> = ({ billingInfo }) => {
  const [isSendMail, setIsSendMail] = useState<boolean>(false);
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
        <Box className="email">Receive Email: {billingInfo?.email}</Box>
      </Box>
    </AppCard>
  );
};

export default Notifications;
