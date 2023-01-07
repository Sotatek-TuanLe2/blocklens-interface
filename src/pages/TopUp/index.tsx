import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
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
import { BasePageContainer } from 'src/layouts';
import useTopUp from 'src/hooks/useTopUp';
import { CHAIN_OPTIONS } from 'src/components/AppCryptoForm';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import Storage from '../../utils/utils-storage';
import AppField from '../../components/AppField';
import AppInput from '../../components/AppInput';
import AppSelect2 from '../../components/AppSelect2';
import AppCurrencyInput from '../../components/AppCurrencyInput';
import { shortenWalletAddress } from '../../utils/utils-wallet';
import useUser from '../../hooks/useUser';
import { getBalanceToken } from '../../utils/utils-token';

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

  const { currencyAddress, amount, chainId } = dataForm;
  const [isBeingToppedUp, setIsBeingToppedUp] = useState<boolean>(false);

  const { wallet, isUserLinked, changeNetwork, connectWallet } = useWallet();
  const { user } = useUser();
  const { isConnecting } = useSelector((state: RootState) => state.wallet);
  const { topUp } = useTopUp();
  const history = useHistory();

  // form

  const AMOUNT_OPTIONS = [300, 500, 1000];

  const [balanceToken, setBalanceToken] = useState<string | number>('');

  const CURRENCY_OPTIONS = useMemo((): {
    label: string;
    value: string;
    icon: string | undefined;
    decimals: number;
  }[] => {
    if (!wallet) {
      return [];
    }
    const networkCurrencies = getNetworkByEnv(
      getChainConfig(dataForm.chainId),
    ).currencies;
    return Object.keys(networkCurrencies).map((currencyKey) => {
      const currency = networkCurrencies[currencyKey];
      return {
        label: currency.name,
        value: currency.address,
        icon: currency.icon,
        decimals: currency.decimals,
      };
    });
  }, [dataForm.chainId]);

  const isDifferentWalletAddressLinked =
    wallet?.getAddress() !== user?.getLinkedAddress();

  // end form

  useEffect(() => {
    const connectorId = Storage.getConnectorId();
    const network = Storage.getNetwork();
    if (!connectorId) return;
    (async () => await connectWallet(connectorId, network))();
  }, []);

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

  useEffect(() => {
    getBalanceToken(chainId, currencyAddress, wallet?.getAddress())
      .then((balance) => setBalanceToken(balance))
      .catch((error) => console.log(error));
  }, [currencyAddress, chainId]);

  const _renderTopUpForm = () => {
    if (!wallet || !user) return null;
    const _renderAlert = () => (
      <Text align={'center'}>
        You linked wallet:{' '}
        <span>{shortenWalletAddress(user?.getLinkedAddress())}</span>
        not <span>{shortenWalletAddress(wallet?.getAddress())}</span>
        <AppButton>Switch</AppButton>
      </Text>
    );

    return (
      <>
        <AppCard className={'box-form-crypto'}>
          {isDifferentWalletAddressLinked && _renderAlert()}
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField
              label={'Linked Wallet'}
              customWidth={'100%'}
              note="Each account has 1 linked wallet. Cryptocurrencies sent from other wallets would not be top up to your account balance.
                    You can change your linked wallet at the Account page."
            >
              <AppInput
                isDisabled={true}
                size="lg"
                value={wallet?.getAddress()}
              />
            </AppField>
            <Box width={isMobile ? '100%' : '49.5%'} zIndex={99}>
              <AppField label={'Chain'} customWidth={'100%'}>
                <AppSelect2
                  size="large"
                  onChange={(value: string) => onChangeChainId(value)}
                  options={CHAIN_OPTIONS}
                  value={dataForm.chainId}
                />
              </AppField>
            </Box>
            <Box width={isMobile ? '100%' : '49.5%'} zIndex={98}>
              <AppField label={'Currency'} customWidth={'100%'}>
                <AppSelect2
                  size="large"
                  onChange={(value: string) => onChangeCurrency(value)}
                  options={CURRENCY_OPTIONS}
                  value={dataForm.currencyAddress}
                />
              </AppField>
            </Box>

            <Flex width={'100%'} flexDirection={isMobile ? 'column' : 'row'}>
              <AppField label={''} customWidth={'49.5%'}>
                <Flex
                  justifyContent="space-between"
                  className="field"
                  flexDirection={isMobile ? 'column-reverse' : 'row'}
                >
                  <Box className="label">Top up amount</Box>
                  <Flex>
                    <Box mr={2} className="label">
                      User balance:
                    </Box>
                    <Box>{balanceToken || '--'}</Box>
                  </Flex>
                </Flex>
                <AppCurrencyInput
                  onChange={(e) =>
                    setDataForm({
                      ...dataForm,
                      amount: e.target.value.trim(),
                    })
                  }
                  render={(ref, props) => (
                    <AppInput ref={ref} value={dataForm.amount} {...props} />
                  )}
                />
              </AppField>
              <Flex className="amount-options">
                {AMOUNT_OPTIONS.map((item: number, index: number) => {
                  return (
                    <Box
                      className={`amount-option ${
                        +dataForm.amount === item ? 'active' : ''
                      }`}
                      key={index}
                      onClick={() =>
                        setDataForm({ ...dataForm, amount: item.toString() })
                      }
                    >
                      {item}
                    </Box>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </AppCard>
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
  };

  const _renderLoading = () => {
    return <Text align={'center'}>Loading...</Text>;
  };

  const onBack = () => history.goBack();

  return (
    <BasePageContainer className="billing-page">
      <Box className="form-card">
        <Flex alignItems={'center'} mb={7}>
          <Box className="icon-arrow-left" mr={6} onClick={onBack} />
          <Box className={'sub-title'}>Top Up</Box>
        </Flex>
        {isConnecting ? (
          _renderLoading()
        ) : wallet && isUserLinked ? (
          _renderTopUpForm()
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
