import React, { FC } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Flex } from '@chakra-ui/react';
import { RadioChecked, RadioNoCheckedIcon } from 'src/assets/icons';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

const PaymentMethod = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <AppCard className="box-info-account payment-method">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">payment methods</Box>
        </Flex>

        <Flex mb={3} cursor={'pointer'}>
          <RadioChecked />
          <Box ml={2}>Card</Box>{' '}
          <Box className="info-payment">
            (•••• •••• •••• {userInfo?.stripePaymentMethod?.card?.last4})
          </Box>
        </Flex>
        <Flex cursor={'pointer'}>
          <RadioNoCheckedIcon /> <Box ml={2}>Crypto</Box>{' '}
          <Box className="info-payment">(Balance: ${userInfo?.balance})</Box>
        </Flex>
      </Box>
    </AppCard>
  );
};

export default PaymentMethod;
