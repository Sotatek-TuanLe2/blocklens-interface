import React, { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { IPlan } from 'src/store/billing';
import { AppCard, AppButton } from 'src/components';
import { ConnectWalletIcon } from 'src/assets/icons';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

interface IPartTopUp {
  planSelected: IPlan;
  onBack: () => void;
}

const PartTopUp: FC<IPartTopUp> = ({ onBack, planSelected }) => {
  const history = useHistory();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Upgrade</Box>
      </Flex>

      <AppCard className="box-connect-wallet">
        <Flex flexWrap={'wrap'} justifyContent={'space-between'} w={'100%'} mb={20}>
          <Box className="box-top-up">
            <Box className="box-top-up__label">ORDER</Box>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Box className="box-top-up__name">
                <Box textTransform={'capitalize'} as={'span'}>
                  {planSelected.name.toLowerCase()}
                </Box> monthly plan
              </Box>
              <Box className="box-top-up__value">${planSelected.price}/mo</Box>
            </Flex>
          </Box>
          <Box className="box-top-up">
            <Box className="box-top-up__label">crypto</Box>

            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Box className="box-top-up__name">Balance</Box>
              <Box className="box-top-up__value">${userInfo.balance}</Box>
            </Flex>
          </Box>
        </Flex>
        <ConnectWalletIcon />
        <Box className="box-connect-wallet__description">
          Insufficient balance. Use Card payment or increase your balance by Top
          up with Crypto.
        </Box>
        <AppButton
          width={'100%'}
          size="lg"
          mb={10}
          onClick={() => history.push('/top-up')}
        >
          Top Up
        </AppButton>
      </AppCard>
    </Box>
  );
};

export default PartTopUp;
