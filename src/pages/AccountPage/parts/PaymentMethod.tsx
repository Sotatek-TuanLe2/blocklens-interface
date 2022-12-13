import React, { FC } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Flex } from '@chakra-ui/react';

interface IPaymentMethod {
  billingInfo: any;
}

const PaymentMethod: FC<IPaymentMethod> = ({ billingInfo }) => {
  return (
    <AppCard className="box-info-account payment-method">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">payment methods</Box>
        </Flex>

        <Flex mb={3}>
          <Box>Card</Box>{' '}
          <Box className="info-payment">
            (•••• •••• •••• {billingInfo?.paymentMethod?.card?.last4})
          </Box>
        </Flex>
        <Flex>
          <Box>Crypto</Box> <Box className="info-payment">(Balance: $--)</Box>
        </Flex>
      </Box>
    </AppCard>
  );
};

export default PaymentMethod;
