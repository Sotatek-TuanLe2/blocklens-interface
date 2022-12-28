import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import 'src/styles/pages/AppDetail.scss';
import { ListCardIcon, CryptoIcon, CircleCheckedIcon } from 'src/assets/icons';
import { PAYMENT_METHOD } from '../index';
import FormCard from './FormCard';
import FormCrypto from './FormCrypto';
import { IPlan } from 'src/store/billing';

interface IPartPaymentInfo {
  onBack: () => void;
  onNext: () => void;
  setPaymentMethod: (value: string) => void;
  paymentMethod: string;
  planSelected: IPlan;
}

const PartPaymentInfo: FC<IPartPaymentInfo> = ({
  onBack,
  onNext,
  paymentMethod,
  setPaymentMethod,
  planSelected,
}) => {
  const _renderPaymentMethod = () => {
    if (paymentMethod === PAYMENT_METHOD.CARD) {
      return <FormCard onClose={onNext} />;
    }
    return <FormCrypto onNext={onNext} planSelected={planSelected} />;
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Payment Info</Box>
      </Flex>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <Box
          onClick={() => setPaymentMethod(PAYMENT_METHOD.CARD)}
          className={`${
            paymentMethod === PAYMENT_METHOD.CARD ? 'active' : ''
          } box-method`}
        >
          <Box className="box-method__name">Card</Box>
          <ListCardIcon />

          {paymentMethod === PAYMENT_METHOD.CARD && (
            <Box className="icon-checked-active">
              <CircleCheckedIcon />
            </Box>
          )}
        </Box>

        <Box
          onClick={() => setPaymentMethod(PAYMENT_METHOD.CRYPTO)}
          className={`${
            paymentMethod === PAYMENT_METHOD.CRYPTO ? 'active' : ''
          } box-method`}
        >
          <Box className="box-method__name">Crypto</Box>
          <CryptoIcon />

          {paymentMethod === PAYMENT_METHOD.CRYPTO && (
            <Box className="icon-checked-active">
              <CircleCheckedIcon />
            </Box>
          )}
        </Box>
      </Flex>
      <Box mt={5}>{_renderPaymentMethod()}</Box>
    </Box>
  );
};

export default PartPaymentInfo;
