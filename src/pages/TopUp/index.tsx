import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/BillingPage.scss';
import 'src/styles/pages/AppDetail.scss';
import { AppButton, AppCard } from 'src/components';
import { isMobile } from 'react-device-detect';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useWallet from 'src/hooks/useWallet';
import { toastError } from 'src/utils/utils-notify';
import { ConnectWalletIcon } from 'src/assets/icons';
import { getChainConfig, getNetworkByEnv } from 'src/utils/utils-network';
import { useHistory, useLocation } from 'react-router-dom';
import { BasePageContainer } from 'src/layouts';
import useTopUp from 'src/hooks/useTopUp';
import AppCryptoForm from 'src/components/AppCryptoForm';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import useUser from 'src/hooks/useUser';
import AppAlertWarning from 'src/components/AppAlertWarning';
import { MetadataPlan } from 'src/store/metadata';

interface IDataForm {
  walletAddress: string;
  chainId: string;
  currencyAddress: string;
  amount: string;
}

export const TOP_UP_PARAMS = {
  PLAN: 'plan',
};

const TopUpPage = () => {
  const initialDataForm: IDataForm = {
    walletAddress: '',
    chainId: '',
    currencyAddress: '',
    amount: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initialDataForm);
  const [isBeingToppedUp, setIsBeingToppedUp] = useState<boolean>(false);
  const [planSelected, setPlanSelected] = useState<MetadataPlan | undefined>();
  const [isSufficientBalance, setIsSufficientBalance] = useState<boolean>(true); // default without any plans

  const { plans } = useSelector((state: RootState) => state.metadata);
  const { wallet, isUserLinked } = useWallet();
  const { user } = useUser();
  const { topUp } = useTopUp();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.search && !!plans.length) {
      const urlParams = new URLSearchParams(location.search);
      const planCode = urlParams.get(TOP_UP_PARAMS.PLAN);
      if (planCode) {
        setPlanSelected(plans.find((item) => item.code === planCode));
      }
    }
  }, [location.search, plans]);

  useEffect(() => {
    if (wallet?.getAddress()) {
      const networkCurrencies = getNetworkByEnv(
        getChainConfig(wallet.getNework()),
      ).currencies;
      const defaultCurrency =
        networkCurrencies[Object.keys(networkCurrencies)[0]];
      setDataForm((prevState) => ({
        ...prevState,
        walletAddress: wallet.getAddress(),
        chainId: wallet.getNework(),
        currencyAddress: defaultCurrency.address,
      }));
    }
  }, [wallet?.getAddress(), wallet?.getNework()]);

  useEffect(() => {
    if (user && planSelected) {
      const isSufficientBalance = new BigNumber(
        user.getBalance(),
      ).isGreaterThanOrEqualTo(new BigNumber(planSelected.price || 0));
      setIsSufficientBalance(isSufficientBalance);
    }
  }, [user, planSelected]);

  const onChangeCurrency = (currencyAddress: string) => {
    setDataForm((prevState) => ({ ...prevState, currencyAddress }));
  };

  const onTopUp = async () => {
    const { currencyAddress, amount } = dataForm;
    if (!wallet || !amount) {
      return;
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

  const _renderWarningBalanceMessage = () => {
    if (isSufficientBalance) {
      return null;
    }
    return (
      <Box width={'100%'}>
        <AppAlertWarning>
          Your current balance is insufficent. Please top-up to meet the plan's
          price!
        </AppAlertWarning>
      </Box>
    );
  };

  const _renderWalletInfo = () => (
    <>
      {_renderWarningBalanceMessage()}
      <AppCryptoForm
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
        <AppButton size={'lg'} onClick={onTopUp} disabled={isBeingToppedUp}>
          Top Up
        </AppButton>
      </Flex>
    </>
  );

  const onBack = () => history.goBack();

  return (
    <BasePageContainer className="billing-page">
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
    </BasePageContainer>
  );
};

export default TopUpPage;
