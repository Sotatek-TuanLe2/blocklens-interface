import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import 'src/styles/pages/AppDetail.scss';
import {
  ListCardIcon,
  CryptoIcon,
  CircleCheckedIcon,
  RadioNoCheckedIcon,
} from 'src/assets/icons';
import { PAYMENT_METHOD } from '../index';
import FormCard from './FormCard';
import FormCrypto from './FormCrypto';
import { MetadataPlan } from 'src/store/metadata';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { getUserProfile } from 'src/store/user';
import { useDispatch } from 'react-redux';

interface IPartPaymentInfo {
  onBack: () => void;
  onNext: () => void;
  setPaymentMethod: (value: string) => void;
  paymentMethod: string;
  planSelected: MetadataPlan;
}

const PartPaymentInfo: FC<IPartPaymentInfo> = ({
  onBack,
  onNext,
  paymentMethod,
  setPaymentMethod,
  planSelected,
}) => {
  const dispatch = useDispatch();

  const onChangePaymentMethod = async () => {
    try {
      await rf
        .getRequest('UserRequest')
        .editInfoUser({ activePaymentMethod: paymentMethod });
      toastSuccess({ message: 'Update Successfully!' });
      await dispatch(getUserProfile());
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  const _renderPaymentMethod = () => {
    if (paymentMethod === PAYMENT_METHOD.CARD) {
      return <FormCard onClose={onNext} onSuccess={onChangePaymentMethod} />;
    }

    if (paymentMethod === PAYMENT_METHOD.CRYPTO) {
      return (
        <FormCrypto
          planSelected={planSelected}
          onSuccess={onChangePaymentMethod}
        />
      );
    }

    return <> </>;
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={3.5} onClick={onBack} />
        <Box className={'sub-title'}>Select Payment Method</Box>
      </Flex>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <Box
          className={`${
            paymentMethod === PAYMENT_METHOD.CARD ? 'active' : ''
          } box-method`}
        >
          <Box
            className="icon-checked-active"
            onClick={() => setPaymentMethod(PAYMENT_METHOD.CARD)}
          >
            {paymentMethod === PAYMENT_METHOD.CARD ? (
              <CircleCheckedIcon />
            ) : (
              <RadioNoCheckedIcon />
            )}
          </Box>

          <Flex flexDirection={'column'} alignItems={'center'}>
            <Box className="box-method__method">Payment with card</Box>
            <ListCardIcon />
          </Flex>
        </Box>

        <Box
          onClick={() => setPaymentMethod(PAYMENT_METHOD.CRYPTO)}
          className={`${
            paymentMethod === PAYMENT_METHOD.CRYPTO ? 'active' : ''
          } box-method`}
        >
          <Box
            className="icon-checked-active"
            onClick={() => setPaymentMethod(PAYMENT_METHOD.CRYPTO)}
          >
            {paymentMethod === PAYMENT_METHOD.CRYPTO ? (
              <CircleCheckedIcon />
            ) : (
              <RadioNoCheckedIcon />
            )}
          </Box>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Box className="box-method__method">Payment with crypto</Box>
            <CryptoIcon />
          </Flex>
        </Box>
      </Flex>
      <Box mt={5}>{_renderPaymentMethod()}</Box>
    </Box>
  );
};

export default PartPaymentInfo;
