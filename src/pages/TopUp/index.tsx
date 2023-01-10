import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useWallet from 'src/hooks/useWallet';
import useUser from 'src/hooks/useUser';
import { RootState } from 'src/store';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  AppCurrencyInput,
  AppSelect2,
  AppField,
  AppInput,
  AppButton,
  AppCard,
  AppConnectWalletButton,
} from 'src/components';
import { ConnectWalletIcon } from 'src/assets/icons';
import { isMobile } from 'react-device-detect';
import { MaxUint256 } from '@ethersproject/constants';
import { BasePageContainer } from 'src/layouts';
import { executeTransaction } from 'src/store/transaction';
import { getUserProfile } from 'src/store/user';
import {
  getChainConfig,
  getChains,
  getNetworkByEnv,
  objectKeys,
} from 'src/utils/utils-network';
import Storage from 'src/utils/utils-storage';
import { toastError } from 'src/utils/utils-notify';
import { getBalanceToken, isTokenApproved } from 'src/utils/utils-token';
import { convertDecToWei } from 'src/utils/utils-format';
import { createValidator } from 'src/utils/utils-validator';
import config from 'src/config';
import abi from 'src/abi';
import 'src/styles/pages/BillingPage.scss';
import 'src/styles/pages/AppDetail.scss';

interface IDataForm {
  walletAddress: string;
  chainId: string;
  currencyAddress: string;
  amount: string;
}

const AMOUNT_OPTIONS = [300, 500, 1000];

const TopUpPage = () => {
  const initialDataForm: IDataForm = {
    walletAddress: '',
    chainId: '',
    currencyAddress: '',
    amount: '',
  };

  const { isConnecting: connectingWallet } = useSelector(
    (state: RootState) => state.wallet,
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const { wallet, changeNetwork, connectWallet } = useWallet();
  const { user } = useUser();

  const [dataForm, setDataForm] = useState<IDataForm>(initialDataForm);
  const { currencyAddress, amount, chainId } = dataForm;
  const [isBeingToppedUp, setIsBeingToppedUp] = useState<boolean>(false);
  const [balanceToken, setBalanceToken] = useState<string | number>('');
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [hasApproveToken, setHasApproveToken] = useState(false);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const topUpContractAddress = wallet
    ? config.topUp.chains[wallet?.getNework()].contractAddress
    : null;
  const topUpAppId = config.topUp.topUpAppId;
  const topUpConfirmations = config.topUp.topUpConfirmations;
  const isDifferentWalletAddressLinked =
    wallet?.getAddress() !== user?.getLinkedAddress();

  const chainOptions = getChains((chain) => chain.allowTopUp);
  const currencyOptions = useMemo((): {
    label: string;
    value: string;
    icon: string | undefined;
    decimals: number;
  }[] => {
    if (!wallet || !chainId) {
      return [];
    }
    const networkCurrencies = getNetworkByEnv(
      getChainConfig(chainId),
    ).currencies;

    return objectKeys(networkCurrencies).map((currencyKey) => {
      const currency = networkCurrencies[currencyKey];
      return {
        label: currency.name,
        value: currency.address,
        icon: currency.icon,
        decimals: currency.decimals,
      };
    });
  }, [chainId]);

  useEffect(() => {
    const connectorId = Storage.getConnectorId();
    const network = Storage.getNetwork();
    if (!connectorId) return;
    (async () => {
      await connectWallet(connectorId, network);
    })();
  }, [wallet?.getNework()]);

  useEffect(() => {
    if (!(wallet && topUpContractAddress)) return;
    isTokenApproved(
      wallet?.getNework(),
      currencyAddress,
      wallet.getAddress(),
      topUpContractAddress,
    )
      .then((result) => setHasApproveToken(result))
      .catch(() => setHasApproveToken(false))
      .finally(() => setDataForm((prevState) => prevState));
  }, [wallet, topUpContractAddress, currencyAddress]);

  useEffect(() => {
    if (!wallet?.getAddress()) return;
    const networkCurrencies = getNetworkByEnv(
      getChainConfig(chainOptions[0].value),
    ).currencies;

    const defaultCurrency = networkCurrencies[objectKeys(networkCurrencies)[0]];
    setDataForm((prevState) => ({
      ...prevState,
      walletAddress: wallet.getAddress(),
      chainId: chainOptions[0].value,
      currencyAddress: defaultCurrency.address,
    }));
  }, [wallet]);

  useEffect(() => {
    if (!(chainId && currencyAddress && wallet?.getAddress())) return;
    setFetchingBalance(true);
    getBalanceToken(chainId, currencyAddress, wallet?.getAddress())
      .then((balance) => {
        setBalanceToken(balance);
      })
      .catch((error) => {
        console.log(error);
        toastError({ message: error.toString() });
      })
      .finally(() => setFetchingBalance(false));
  }, [currencyAddress, chainId, wallet?.getAddress()]);

  const approveToken = async () => {
    await dispatch(
      executeTransaction({
        provider: wallet?.getProvider(),
        params: {
          contractAddress: currencyAddress,
          abi: abi['erc20'],
          action: 'approve',
          transactionArgs: [topUpContractAddress, MaxUint256.toString()],
        },
      }),
    );
  };

  const topUp = async (currencyAddress: string, amount: string) => {
    if (!(wallet && topUpContractAddress)) {
      return;
    }
    const networkCurrencies = getNetworkByEnv(
      getChainConfig(wallet.getNework()),
    ).currencies;
    const currencyKey = Object.keys(networkCurrencies).find(
      (currencyKey: string) =>
        networkCurrencies[currencyKey].address === currencyAddress,
    );

    if (!currencyKey) {
      return;
    }

    await dispatch(
      executeTransaction({
        provider: wallet.getProvider(),
        params: {
          contractAddress: topUpContractAddress,
          abi: abi['billing'],
          action: 'topup',
          transactionArgs: [
            topUpAppId,
            currencyAddress,
            convertDecToWei(amount, networkCurrencies[currencyKey].decimals),
          ],
        },
        confirmation: topUpConfirmations,
      }),
    );
    await dispatch(getUserProfile());
  };

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
      setDataForm((prevState) => ({ ...prevState, amount: '0' }));
      setIsBeingToppedUp(false);
    } catch (error: any) {
      setIsBeingToppedUp(false);
      console.error(error);
      toastError({ message: error?.data?.message || error?.message });
    }
  };

  const _renderTopUpForm = () => {
    if (!(wallet && user)) {
      return null;
    }
    const _renderAlert = () => (
      <Alert
        status="warning"
        borderRadius={'6px'}
        bg={'rgba(255, 181, 71, 0.1)'}
        mb={'8px'}
      >
        <AlertIcon />
        <AlertDescription color={'yellow.100'}>
          You linked wallet: {user?.getLinkedAddress()} not{' '}
          {wallet?.getAddress()}
        </AlertDescription>
      </Alert>
    );

    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (hasApproveToken) {
            await onTopUp();
          } else await approveToken();
        }}
      >
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
                  options={chainOptions}
                  value={chainId}
                />
              </AppField>
            </Box>
            <Box width={isMobile ? '100%' : '49.5%'} zIndex={98}>
              <AppField label={'Currency'} customWidth={'100%'}>
                <AppSelect2
                  size="large"
                  onChange={(value: string) => onChangeCurrency(value)}
                  options={currencyOptions}
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
                  <Flex alignItems={'center'}>
                    <Box mr={2} className="label">
                      User balance:
                    </Box>
                    {!fetchingBalance ? (
                      <Box>{balanceToken || '--'}</Box>
                    ) : (
                      <Spinner size={'sm'} />
                    )}
                  </Flex>
                </Flex>
                <AppCurrencyInput
                  onChange={(e) =>
                    setDataForm({
                      ...dataForm,
                      amount: e.target.value.trim(),
                    })
                  }
                  disabled={fetchingBalance}
                  render={(ref, props) => (
                    <AppInput
                      ref={ref}
                      value={amount}
                      validate={{
                        name: 'amount',
                        validator: validator.current,
                        rule: [`insufficientBalance:${balanceToken}`],
                      }}
                      {...props}
                    />
                  )}
                />
              </AppField>
              <Flex className="amount-options">
                {AMOUNT_OPTIONS.map((item: number, index: number) => {
                  return (
                    <Button
                      disabled={fetchingBalance}
                      className={`amount-option ${
                        +dataForm.amount === item ? 'active' : ''
                      }`}
                      key={index}
                      onClick={() =>
                        setDataForm({ ...dataForm, amount: item.toString() })
                      }
                    >
                      {item}
                    </Button>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </AppCard>
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
          <AppButton
            type={'submit'}
            size={'lg'}
            isLoading={fetchingBalance}
            loadingText={'Loading...'}
            disabled={
              fetchingBalance ||
              (hasApproveToken &&
                (isBeingToppedUp || +amount <= 0 || +amount > balanceToken))
            }
          >
            {hasApproveToken ? `Top Up` : 'Approve Token'}
          </AppButton>
        </Flex>
      </form>
    );
  };

  const _renderLoading = () => {
    return (
      <Flex alignItems={'center'} justifyContent={'center'}>
        <Spinner size={'xl'} thickness={'4px'} />
      </Flex>
    );
  };

  const onBack = () => history.goBack();

  return (
    <BasePageContainer className="billing-page">
      <Box className="form-card">
        <Flex alignItems={'center'} mb={7}>
          <Box className="icon-arrow-left" mr={6} onClick={onBack} />
          <Box className={'sub-title'}>Top Up</Box>
        </Flex>
        {connectingWallet ? (
          _renderLoading()
        ) : wallet ? (
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
