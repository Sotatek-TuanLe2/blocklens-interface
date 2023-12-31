import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppButton } from 'src/components';
import { ConnectWalletIcon } from 'src/assets/icons';
import { useHistory } from 'react-router';
import useUser from 'src/hooks/useUser';
import { MetadataPlan } from 'src/store/metadata';

interface IPartTopUp {
  planSelected: MetadataPlan;
  onBack: () => void;
}

const PartTopUp: FC<IPartTopUp> = ({ onBack, planSelected }) => {
  const history = useHistory();
  const { user } = useUser();

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={3.5} onClick={onBack} />
        <Box className={'sub-title'}>Upgrade</Box>
      </Flex>
      <Flex
        flexWrap={'wrap'}
        justifyContent={'space-between'}
        w={'100%'}
        mb={5}
      >
        <Box className="box-top-up">
          <AppCard>
            <Box>
              <Box className="box-top-up__label">ORDER</Box>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Box className="box-top-up__name">
                  <Box textTransform={'capitalize'} as={'span'}>
                    {planSelected.name.toLowerCase()}
                  </Box>{' '}
                  monthly plan
                </Box>
                <Box className="box-top-up__value">
                  ${planSelected.price}/mo
                </Box>
              </Flex>
            </Box>
          </AppCard>
        </Box>

        <Box className="box-top-up">
          <AppCard>
            <Box className="box-top-up__label">crypto</Box>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Box className="box-top-up__name">Balance</Box>
              <Box className="box-top-up__value">${user?.getBalance()}</Box>
            </Flex>
          </AppCard>
        </Box>
      </Flex>

      <AppCard className="box-connect-wallet">
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
