import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { MaxUint256 } from '@ethersproject/constants';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/AppDetail.scss';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppSelect2,
} from 'src/components';
import { isMobile } from 'react-device-detect';
import config from 'src/config';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useWallet from 'src/hooks/useWallet';
import { isTokenApproved } from 'src/utils/utils-token';
import { toastError, toastInfo } from 'src/utils/utils-notify';
import { convertDecToWei } from 'src/utils/utils-format';
import { useDispatch, useSelector } from 'react-redux';
import { executeTransaction } from 'src/store/transaction';
import abi from 'src/abi';
import { getInfoUser } from 'src/store/auth';
import useUser from 'src/hooks/useUser';
import { RootState } from 'src/store';
import { ConnectWalletIcon } from 'src/assets/icons';
import AppAlertWarning from 'src/components/AppAlertWarning';
import { getChainConfig, getNetworkByEnv } from 'src/utils/utils-network';

interface IFormCrypto {
  onBack: () => void;
  onNext: () => void;
  planSelected: string;
}

interface IDataForm {
  walletAddress: string;
  chainId: string;
  currencyAddress: string;
  amount: string;
}

const optionsAmount = [300, 500, 1000];

const FormCrypto: FC<IFormCrypto> = ({ onBack, onNext, planSelected }) => {
  const initialDataForm: IDataForm = {
    walletAddress: '',
    chainId: '',
    currencyAddress: '',
    amount: '',
  };

  enum TOP_UP_STATUS {
    NONE,
    PENDING,
    FINISHED,
  }

  const TOP_UP_APP_ID = 1; // used for blockSniper
  const TOP_UP_CONFIRMATIONS = 30;

  const { plans } = useSelector((state: RootState) => state.billing);
  const [dataForm, setDataForm] = useState<IDataForm>(initialDataForm);
  const [topUpStatus, setTopUpStatus] = useState<number>(TOP_UP_STATUS.NONE);
  const [isCorrectAddress, setIsCorrectAddress] = useState<boolean>(true);
  const [isSufficientBalance, setIsSufficientBalance] =
    useState<boolean>(false);
  const { wallet, changeNetwork } = useWallet();
  const { user } = useUser();
  const dispatch = useDispatch();

  const newPlan = plans.find((item) => item.code === planSelected);

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
    if (wallet?.getAddress() && user?.getLinkedAddress()) {
      setIsCorrectAddress(wallet.getAddress() === user.getLinkedAddress());
    }
  }, [wallet?.getAddress(), user?.getLinkedAddress()]);

  useEffect(() => {
    if (user?.getBalance() && newPlan) {
      if (
        new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
          new BigNumber(newPlan.price || 0),
        )
      ) {
        setIsSufficientBalance(true);
        setTopUpStatus(TOP_UP_STATUS.FINISHED);
      } else {
        setIsSufficientBalance(false);
        setTopUpStatus(TOP_UP_STATUS.NONE);
      }
    }
  }, [user?.getBalance()]);

  const CHAIN_OPTIONS = useMemo((): {
    label: string;
    value: string;
    icon: string | undefined;
  }[] => {
    if (!wallet) {
      return [];
    }
    return Object.keys(config.chains).map((chainKey) => {
      const chain = config.chains[chainKey];
      return { label: chain.name, value: chain.id, icon: chain.icon };
    });
  }, [wallet?.getNework()]);

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
      getChainConfig(wallet.getNework()),
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
  }, [wallet?.getNework()]);

  const onChangeCurrency = (currencyAddress: string) => {
    setDataForm((prevState) => ({ ...prevState, currencyAddress }));
  };

  const approveToken = async (
    network: string,
    currencyAddress: string,
    walletAddress: string,
    contractAddress: string,
  ) => {
    const isApproved = await isTokenApproved(
      network,
      currencyAddress,
      walletAddress,
      contractAddress,
    );
    if (isApproved) {
      return;
    }
    toastInfo({ message: 'You need to give permission to access your token' });
    await dispatch(
      executeTransaction({
        provider: wallet?.getProvider(),
        params: {
          contractAddress: currencyAddress,
          abi: abi['erc20'],
          action: 'approve',
          transactionArgs: [contractAddress, MaxUint256.toString()],
        },
      }),
    );
  };

  const onTopUp = async () => {
    const { currencyAddress, amount } = dataForm;
    if (!wallet || !amount) {
      return;
    }
    try {
      setTopUpStatus(TOP_UP_STATUS.PENDING);
      const topUpContractAddress =
        config.topUp[dataForm.chainId].contractAddress;
      await approveToken(
        wallet.getNework(),
        currencyAddress,
        wallet.getAddress(),
        topUpContractAddress,
      );
      const currencyDecimal = CURRENCY_OPTIONS.find(
        (item) => item.value === currencyAddress,
      )?.decimals;
      await dispatch(
        executeTransaction({
          provider: wallet.getProvider(),
          params: {
            contractAddress: topUpContractAddress,
            abi: abi['billing'],
            action: 'topup',
            transactionArgs: [
              TOP_UP_APP_ID,
              currencyAddress,
              convertDecToWei(amount, currencyDecimal),
            ],
          },
          confirmation: TOP_UP_CONFIRMATIONS,
        }),
      );
      await dispatch(getInfoUser());
    } catch (error: any) {
      setTopUpStatus(TOP_UP_STATUS.NONE);
      console.error(error);
      toastError({ message: error.data.message || error.message });
    }
  };

  const _renderTopUpMessage = () => {
    if (topUpStatus === TOP_UP_STATUS.NONE) {
      return null;
    }
    return (
      <AppAlertWarning>
        When payment is completed, Continue button would be available.
      </AppAlertWarning>
    );
  };

  const _renderWalletInfo = () => {
    if (!isCorrectAddress) {
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
    return (
      <>
        <AppCard className={'box-form-crypto'}>
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            {!isSufficientBalance && (
              <Box width={'100%'}>
                <AppAlertWarning>
                  Your current balance is insufficent. Please top-up to meet the
                  plan's price!
                </AppAlertWarning>
              </Box>
            )}
            <AppField
              label={'Linked Wallet'}
              customWidth={'100%'}
              note="Each account has 1 linked wallet. Cryptocurrencies sent from other wallets would not be top up to your account balance.
                    You can change your linked wallet at the Account page."
            >
              <AppInput
                isDisabled={true}
                size="lg"
                value={dataForm.walletAddress}
              />
            </AppField>
            <Box width={isMobile ? '100%' : '49.5%'} zIndex={99}>
              <AppField label={'Chain'} customWidth={'100%'}>
                <AppSelect2
                  size="large"
                  onChange={(value: string) => changeNetwork(value)}
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
            <AppField label={'Amount'} customWidth={'49.5%'}>
              <AppInput
                size="lg"
                placeholder="0"
                value={dataForm.amount}
                onChange={(e) => {
                  setDataForm({
                    ...dataForm,
                    amount: e.target.value.trim(),
                  });
                }}
                endAdornment={
                  <Flex className="amount-options">
                    {optionsAmount.map((item: number, index: number) => {
                      return (
                        <Box
                          className={`amount-option ${
                            +dataForm.amount === item ? 'active' : ''
                          }`}
                          key={index}
                          onClick={() => {
                            setDataForm({
                              ...dataForm,
                              amount: item.toString(),
                            });
                          }}
                        >
                          {item}
                        </Box>
                      );
                    })}
                  </Flex>
                }
              />
            </AppField>
          </Flex>
        </AppCard>
        {_renderTopUpMessage()}
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
          <AppButton
            size={'lg'}
            onClick={topUpStatus === TOP_UP_STATUS.NONE ? onTopUp : onNext}
            disabled={topUpStatus === TOP_UP_STATUS.PENDING}
          >
            {topUpStatus === TOP_UP_STATUS.NONE ? 'Top Up' : 'Continue'}
          </AppButton>
        </Flex>
      </>
    );
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Crypto</Box>
      </Flex>
      {wallet ? (
        _renderWalletInfo()
      ) : (
        <AppCard className="box-connect-wallet">
          <ConnectWalletIcon />
          <Box className="box-connect-wallet__description">
            Connect wallet to top up your balance amount and perform payment
            with cryptocurrencies.
          </Box>
          <AppConnectWalletButton width={'100%'} size="lg">
            Connect Wallet
          </AppConnectWalletButton>
        </AppCard>
      )}
    </Box>
  );
};

export default FormCrypto;
