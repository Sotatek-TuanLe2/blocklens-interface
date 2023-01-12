import { Box } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
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

interface IFormCrypto {
  onSuccess: () => void;
  planSelected: MetadataPlan;
}

const FormCrypto: FC<IFormCrypto> = ({ onSuccess, planSelected }) => {
  const [isSufficientBalance, setIsSufficientBalance] =
    useState<boolean>(false);
  const { wallet, isUserLinked } = useWallet();
  const { user } = useUser();
  const history = useHistory();

  useEffect(() => {
    if (user?.getBalance() && planSelected) {
      if (
        new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
          new BigNumber(planSelected.price || 0),
        )
      ) {
        setIsSufficientBalance(true);
      } else {
        setIsSufficientBalance(false);
      }
    }
  }, [user?.getBalance()]);

  const _renderWalletInfo = () => {
    if (wallet?.getAddress() !== user?.getLinkedAddress()) {
      return (
        <AppAlertWarning>
          <Box>
            You are connecting with different address: {wallet?.getAddress()}.
          </Box>
          <Box>
            Please connect with linked address: {user?.getLinkedAddress()}.
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
            onClick={() => history.push('/top-up')}
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
          <ConnectWalletIcon />
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
