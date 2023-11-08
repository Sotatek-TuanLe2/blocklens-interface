import { Box } from '@chakra-ui/react';
import React, { FC, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/AppDetail.scss';
import { AppButton, AppCard } from 'src/components';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useWallet from 'src/hooks/useWallet';
import useUser from 'src/hooks/useUser';
import { ConnectWalletIcon } from 'src/assets/icons';
import { MetadataPlan } from 'src/store/metadata';
import { useHistory } from 'react-router';
import AppAlertWarning from 'src/components/AppAlertWarning';
import { ROUTES } from 'src/utils/common';

interface IFormCrypto {
  onSuccess: () => void;
  planSelected: MetadataPlan;
}

const FormCrypto: FC<IFormCrypto> = ({ onSuccess, planSelected }) => {
  const { wallet, isUserLinked } = useWallet();
  const { user } = useUser();
  const history = useHistory();

  const isSufficientBalance = useMemo(() => {
    if (!user || !planSelected) {
      return false;
    }

    return new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
      new BigNumber(planSelected.price || 0),
    );
  }, [user?.getBalance(), planSelected]);

  const _renderWalletInfo = () => {
    if (
      user?.isUserLinked() &&
      wallet?.getAddress() !== user?.getLinkedAddresses()[0]
    ) {
      return (
        <AppAlertWarning>
          <Box>
            You are connecting with different address: {wallet?.getAddress()}.
          </Box>
          <Box>
            Please connect with linked address: {user?.getLinkedAddresses()[0]}.
          </Box>
        </AppAlertWarning>
      );
    }

    if (!isSufficientBalance) {
      return (
        <AppCard className="box-connect-wallet">
          <ConnectWalletIcon />
          <Box className="box-connect-wallet__description">
            Insufficient balance. Use Card payment or increase your balance by
            Top up with Crypto.
          </Box>
          <AppButton
            width={'100%'}
            size="lg"
            onClick={() => history.push(ROUTES.TOP_UP)}
          >
            Top Up
          </AppButton>
        </AppCard>
      );
    }

    return <></>;
  };

  return (
    <Box className="form-card">
      {wallet && isUserLinked ? (
        _renderWalletInfo()
      ) : (
        <AppCard className="box-connect-wallet">
          <ConnectWalletIcon width={126} />
          <Box className="box-connect-wallet__description">
            Connect wallet to top up your balance amount and perform payment
            with cryptocurrencies.
          </Box>
          <AppConnectWalletButton
            width={'100%'}
            size="lg"
            onConnectSuccess={onSuccess}
          >
            Connect Wallet
          </AppConnectWalletButton>
        </AppCard>
      )}
    </Box>
  );
};

export default FormCrypto;
