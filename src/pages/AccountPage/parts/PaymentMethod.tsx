import React, { useEffect, useState } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Flex } from '@chakra-ui/react';
import { formatShortText } from 'src/utils/utils-helper';
import { isMobile } from 'react-device-detect';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import ModalPayment from 'src/modals/ModalPayment';

const PaymentMethod = () => {
  const [billingInfo, setBillingInfo] = useState<any>({});
  const [isOpenChangePaymentMethod, setIsOpenChangePaymentMethod] =
    useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<any>({});

  const getPaymentIntent = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getPaymentIntent();
      setPaymentIntent(res);
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    getPaymentIntent().then();
  }, [isOpenChangePaymentMethod]);

  const getBillingInfo = async () => {
    try {
      const res = await rf.getRequest('BillingRequest').getBillingInfo();
      setBillingInfo(res || {});
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };
  useEffect(() => {
    getBillingInfo().then();
  }, []);

  const _renderLink = () => {
    return (
      <Flex>
        <Box className="link" mr={5}>
          Top Up With Crypto
        </Box>
        <Box
          className="link"
          onClick={() => setIsOpenChangePaymentMethod(true)}
        >
          Change
        </Box>
      </Flex>
    );
  };

  return (
    <AppCard className="box-info-account payment-method" mt={5}>
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">payment methods</Box>
          {!isMobile && _renderLink()}
        </Flex>

        <Flex mb={2.5} flexDirection={isMobile ? 'column' : 'row'}>
          <Box className="label">Card:</Box>
          <Box className="value" textTransform="capitalize">
            {billingInfo?.paymentMethod?.card.brand} - •••• •••• ••••{' '}
            {billingInfo?.paymentMethod?.card?.last4}
          </Box>
        </Flex>
        <Flex flexDirection={isMobile ? 'column' : 'row'}>
          <Box className="label">Blocklens Balance:</Box>
          <Box className="value">
            <Box mb={1}>Total: --</Box>
            <Box>Primary Wallet: {formatShortText('')}</Box>
          </Box>
        </Flex>

        {isMobile && <Box mt={4}>{_renderLink()}</Box>}
      </Box>

      {isOpenChangePaymentMethod && (
        <ModalPayment
          open={isOpenChangePaymentMethod}
          onClose={() => setIsOpenChangePaymentMethod(false)}
          reloadData={getBillingInfo}
          paymentIntent={paymentIntent}
        />
      )}
    </AppCard>
  );
};

export default PaymentMethod;
