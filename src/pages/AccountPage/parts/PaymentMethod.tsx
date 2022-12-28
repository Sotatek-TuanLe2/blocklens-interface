import React, { FC } from 'react';
import 'src/styles/pages/AccountPage.scss';
import { AppCard } from 'src/components';
import { Box, Flex } from '@chakra-ui/react';
import { RadioChecked, RadioNoCheckedIcon } from 'src/assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getInfoUser } from 'src/store/auth';
import { PAYMENT_METHOD } from '../../BillingPage';

const PaymentMethod = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();
  const onChangePaymentMethod = async (method: string) => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: method });
      toastSuccess({ message: 'Update Successfully!' });
      dispatch(getInfoUser());
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  return (
    <AppCard className="box-info-account payment-method">
      <Box className="info-item">
        <Flex justifyContent={'space-between'}>
          <Box className="title">payment methods</Box>
        </Flex>

        <Flex
          mb={3}
          cursor={'pointer'}
          width="max-content"
          onClick={() => onChangePaymentMethod(PAYMENT_METHOD.CARD)}
        >
          {userInfo?.activePaymentMethod === PAYMENT_METHOD.CARD ? (
            <RadioChecked />
          ) : (
            <RadioNoCheckedIcon />
          )}
          <Box ml={2}>Card</Box>{' '}
          <Box className="info-payment">
            (
            {userInfo?.stripePaymentMethod
              ? `${userInfo?.stripePaymentMethod?.card?.brand} - ${userInfo?.stripePaymentMethod?.card?.last4}`
              : '--'}
            )
          </Box>
        </Flex>
        <Flex
          cursor={'pointer'}
          width="max-content"
          onClick={() => onChangePaymentMethod(PAYMENT_METHOD.CRYPTO)}
        >
          {userInfo?.activePaymentMethod === PAYMENT_METHOD.CRYPTO ? (
            <RadioChecked />
          ) : (
            <RadioNoCheckedIcon />
          )}{' '}
          <Box ml={2}>Crypto</Box>{' '}
          <Box className="info-payment">(Balance: ${userInfo?.balance})</Box>
        </Flex>
      </Box>
    </AppCard>
  );
};

export default PaymentMethod;
