import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import 'src/styles/pages/BillingPage.scss';
import 'src/styles/pages/AppDetail.scss';
import { AppButton, AppCard } from 'src/components';
import { isMobile } from 'react-device-detect';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useWallet from 'src/hooks/useWallet';
import { toastError } from 'src/utils/utils-notify';
import { ConnectWalletIcon } from 'src/assets/icons';
import { getChainConfig, getNetworkByEnv } from 'src/utils/utils-network';
import { useHistory } from 'react-router-dom';
import { GuestPage } from 'src/layouts';
import useTopUp from 'src/hooks/useTopUp';
import AppCryptoForm, { CHAIN_OPTIONS } from 'src/components/AppCryptoForm';

interface IDataForm {
  walletAddress: string;
  chainId: string;
  currencyAddress: string;
  amount: string;
}

const TopUpPage = () => {
  const initialDataForm: IDataForm = {
    walletAddress: '',
    chainId: '',
    currencyAddress: '',
    amount: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initialDataForm);
  const [isBeingToppedUp, setIsBeingToppedUp] = useState<boolean>(false);

  const { wallet, isUserLinked, changeNetwork } = useWallet();
  const { topUp } = useTopUp();
  const history = useHistory();

  useEffect(() => {
    if (wallet?.getAddress()) {
      const networkCurrencies = getNetworkByEnv(
        getChainConfig(CHAIN_OPTIONS[0].value),
      ).currencies;
      const defaultCurrency =
        networkCurrencies[Object.keys(networkCurrencies)[0]];
      setDataForm((prevState) => ({
        ...prevState,
        walletAddress: wallet.getAddress(),
        chainId: CHAIN_OPTIONS[0].value,
        currencyAddress: defaultCurrency.address,
      }));
    }
  }, [wallet]);

  const onChangeCurrency = (currencyAddress: string) => {
    setDataForm((prevState) => ({ ...prevState, currencyAddress }));
  };

  const onChangeChainId = (chainId: string) => {
    const networkCurrencies = getNetworkByEnv(
      getChainConfig(chainId),
    ).currencies;
    const defaultCurrency =
      networkCurrencies[Object.keys(networkCurrencies)[0]];
    setDataForm((prevState) => ({
      ...prevState,
      chainId,
      currencyAddress: defaultCurrency.address,
    }));
  };

  const onTopUp = async () => {
    const { currencyAddress, amount, chainId } = dataForm;
    if (!wallet || !amount) {
      return;
    }

    if (chainId !== wallet.getChainId()) {
      await changeNetwork(chainId);
    }

    try {
      setIsBeingToppedUp(true);
      await topUp(currencyAddress, amount);
      setIsBeingToppedUp(false);
    } catch (error: any) {
      setIsBeingToppedUp(false);
      console.error(error);
      toastError({ message: error.data.message || error.message });
    }
  };

  const _renderWalletInfo = () => (
    <>
      <AppCryptoForm
        chainId={dataForm.chainId}
        onChangeChainId={(value) => onChangeChainId(value)}
        currencyAddress={dataForm.currencyAddress}
        amount={dataForm.amount}
        onChangeCurrencyAddress={(value) => onChangeCurrency(value)}
        onChangeAmount={(value) =>
          setDataForm({
            ...dataForm,
            amount: value,
          })
        }
      />
      <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
        <AppButton
          size={'lg'}
          onClick={onTopUp}
          disabled={isBeingToppedUp || +dataForm.amount <= 0}
        >
          Top Up
        </AppButton>
      </Flex>
    </>
  );

  const onBack = () => history.goBack();

  return (
    <GuestPage className="billing-page">
      <Box className="form-card">
        <Flex alignItems={'center'} mb={7}>
          <Box className="icon-arrow-left" mr={6} onClick={onBack} />
          <Box className={'sub-title'}>Top Up</Box>
        </Flex>
        {wallet && isUserLinked ? (
          _renderWalletInfo()
        ) : (
          <AppCard className="box-connect-wallet">
            <ConnectWalletIcon />
            <Box className="box-connect-wallet__description">
              Connect wallet to top up your balance amount.
            </Box>
            <AppConnectWalletButton width={'100%'} size="lg">
              Connect Wallet
            </AppConnectWalletButton>
          </AppCard>
        )}
      </Box>
    </GuestPage>
  );
};

export default TopUpPage;
