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
import { MaxUint256 } from '@ethersproject/constants';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import abi from 'src/abi';
import { ConnectWalletIcon } from 'src/assets/icons';
import {
  AppButton,
  AppCard,
  AppConnectWalletButton,
  AppCurrencyInput,
  AppField,
  AppInput,
  AppSelect2,
} from 'src/components';
import config from 'src/config';
import useUser from 'src/hooks/useUser';
import useWallet from 'src/hooks/useWallet';
import { BasePage } from 'src/layouts';
import { RootState } from 'src/store';
import { executeTransaction } from 'src/store/transaction';
import { getUserProfile } from 'src/store/user';
import 'src/styles/pages/AppDetail.scss';
import 'src/styles/pages/BillingPage.scss';
import { convertDecToWei } from 'src/utils/utils-format';
import {
  convertCurrencyToNumber,
  getErrorMessage,
} from 'src/utils/utils-helper';
import {
  getSupportChainsTopUp,
  getTopUpConfigByNetworkId,
  getTopUpCurrenciesByChainId,
  getTopUpCurrencyOptions,
} from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';
import Storage from 'src/utils/utils-storage';
import { getBalanceToken, isTokenApproved } from 'src/utils/utils-token';
import { createValidator } from 'src/utils/utils-validator';

const AMOUNT_OPTIONS = [300, 500, 1000];

const TopUpPage = () => {
  const { isConnecting: connectingWallet } = useSelector(
    (state: RootState) => state.wallet,
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const { wallet, changeNetwork, connectWallet } = useWallet();
  const { user } = useUser();

  const [chainId, setChainId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currencyAddress, setCurrencyAddress] = useState<string>('');

  const [processing, setProcessing] = useState(false);
  const [balanceToken, setBalanceToken] = useState<string | number>('');
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [hasApproveToken, setHasApproveToken] = useState(false);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const topUpContractAddress = chainId
    ? getTopUpConfigByNetworkId(chainId).contractAddress
    : null;
  const isDifferentWalletAddressLinked =
    wallet?.getAddress() !== user?.getLinkedAddress();
  const chainOptions = getSupportChainsTopUp();
  const inValidAmount =
    +amount <= 0 || convertCurrencyToNumber(amount) > balanceToken;

  useEffect(() => {
    const defaultChain =
      chainOptions.find((chain) => chain.value === 'BSC') || chainOptions[0];
    onChangeChain(defaultChain.value);
  }, []);

  useEffect(() => {
    if (chainId === '') return;
    const currencies = getTopUpCurrenciesByChainId(chainId);
    onChangeCurrency(currencies[0].address);
    setAmount('');
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
    if (!(chainId && wallet && topUpContractAddress && currencyAddress)) return;
    setAmount('');
    setFetchingInfo(true);
    Promise.all([checkApproveToken(), fetchBalance()])
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setFetchingInfo(false));
  }, [wallet, currencyAddress]);

  const fetchBalance = async () => {
    try {
      const balance = await getBalanceToken(
        chainId,
        currencyAddress,
        wallet?.getAddress(),
      );
      setBalanceToken(balance);
    } catch (error) {
      setBalanceToken('0');
    }
  };
  const onChangeChain = (value: string) => {
    setChainId(value);
  };
  const onChangeCurrency = (currencyAddress: string) => {
    setCurrencyAddress(currencyAddress);
  };

  const checkApproveToken = async () => {
    if (!(chainId && wallet && topUpContractAddress && currencyAddress)) return;
    const result = await isTokenApproved(
      chainId,
      currencyAddress,
      wallet.getAddress(),
      topUpContractAddress,
    );
    setHasApproveToken(result);
  };

  const approveToken = async () => {
    setProcessing(true);
    try {
      if (chainId !== wallet?.getChainId()) {
        await changeNetwork(chainId);
      }
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

      await checkApproveToken();
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    } finally {
      setProcessing(false);
    }
  };

  const topUp = async (currencyAddress: string, amount: string) => {
    if (!(wallet && topUpContractAddress)) {
      return;
    }

    const currencyOptions = getTopUpCurrencyOptions(chainId);
    const decimal = currencyOptions.find(
      (option) => option.value === currencyAddress,
    )?.decimals;

    try {
      await dispatch(
        executeTransaction({
          provider: wallet.getProvider(),
          params: {
            contractAddress: topUpContractAddress,
            abi: abi['topup'],
            action: 'topup',
            transactionArgs: [
              config.topUp.appId,
              currencyAddress,
              convertDecToWei(amount, decimal),
            ],
          },
          confirmation: config.topUp.confirmations,
        }),
      );
      await dispatch(getUserProfile());
    } catch (error) {
      console.error(error);
    }
  };

  const onTopUp = async () => {
    if (!wallet || !amount) {
      return;
    }

    try {
      if (chainId !== wallet.getChainId()) {
        await changeNetwork(chainId);
      }
      setProcessing(true);
      await topUp(currencyAddress, amount);
      await fetchBalance();
      setAmount('');
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
    } finally {
      setProcessing(false);
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
          await onTopUp();
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
                  onChange={(value: string) => {
                    onChangeChain(value);
                  }}
                  options={chainOptions}
                  value={chainId}
                  disabled={fetchingInfo}
                />
              </AppField>
            </Box>
            <Box width={isMobile ? '100%' : '49.5%'} zIndex={98}>
              <AppField label={'Currency'} customWidth={'100%'}>
                <AppSelect2
                  size="large"
                  onChange={(value: string) => onChangeCurrency(value)}
                  options={getTopUpCurrencyOptions(chainId)}
                  value={currencyAddress}
                  disabled={fetchingInfo}
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
                    {!fetchingInfo ? (
                      <Box>{balanceToken || '--'}</Box>
                    ) : (
                      <Spinner size={'sm'} />
                    )}
                  </Flex>
                </Flex>
                <AppCurrencyInput
                  onChange={(e) => setAmount(e.target.value.trim())}
                  disabled={fetchingInfo}
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
                      disabled={fetchingInfo || processing}
                      className={`amount-option ${
                        +amount === item ? 'active' : ''
                      }`}
                      key={index}
                      onClick={() => {
                        setAmount(item.toString());
                        validator.current.showMessages();
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
          {fetchingInfo && (
            <Text fontSize={'12px'}>
              Please waiting until it has already loaded
            </Text>
          )}
        </AppCard>
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
          <AppButton
            type={'submit'}
            size={'lg'}
            disabled={
              !hasApproveToken || fetchingInfo || processing || inValidAmount
            }
          >
            Top up
          </AppButton>
          {!hasApproveToken && (
            <AppButton
              marginLeft={'8px'}
              type={'button'}
              size={'lg'}
              disabled={fetchingInfo || processing || inValidAmount}
              onClick={approveToken}
            >
              Approve token
            </AppButton>
          )}
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
    <BasePage className="billing-page">
      <Box className="form-card">
        <Flex alignItems={'center'} mb={7}>
          <Box className="icon-arrow-left" mr={3.5} onClick={onBack} />
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
    </BasePage>
  );
};

export default TopUpPage;
