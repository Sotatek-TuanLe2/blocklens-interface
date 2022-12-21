import { Box, Flex } from '@chakra-ui/react';
import { FC, useEffect, useMemo, useState } from 'react';
import { MaxUint256 } from '@ethersproject/constants';
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
import { useDispatch } from 'react-redux';
import { executeTransaction } from 'src/store/transaction';
import abi from 'src/abi';
import { getInfoUser } from 'src/store/auth';

interface IFormCrypto {
  onBack: () => void;
  onNext: () => void;
}

interface IDataForm {
  walletAddress: string;
  chainId: string;
  currencyAddress: string;
  amount: string;
}

const FormCrypto: FC<IFormCrypto> = ({ onBack, onNext }) => {
  const initialDataForm: IDataForm = {
    walletAddress: '',
    chainId: '',
    currencyAddress: '',
    amount: '',
  };

  enum TOP_UP_STATUS {
    NONE,
    PENDING,
    FINISHED
  }

  const TOP_UP_APP_ID = 1; // used for blockSniper
  const TOP_UP_CONFIRMATIONS = 30;

  const [dataForm, setDataForm] = useState<IDataForm>(initialDataForm);
  const [topUpStatus, setTopUpStatus] = useState<number>(TOP_UP_STATUS.NONE);
  const { wallet, changeNetwork } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet?.getAddress()) {
      const networkCurrencies = config.networks[wallet.getNework()].currencies;
      const defaultCurrency = networkCurrencies[Object.keys(networkCurrencies)[0]];
      setDataForm(prevState => ({
        ...prevState,
        walletAddress: wallet.getAddress(),
        chainId: wallet.getNework(),
        currencyAddress: defaultCurrency.address
      }));
    }
  }, [wallet?.getAddress(), wallet?.getNework()]);

  const CHAIN_OPTIONS = useMemo((): {
    label: string,
    value: string,
    icon: string | undefined
  }[] => {
    if (!wallet) {
      return [];
    }
    return Object.keys(config.networks).map((networkKey) => {
      const network = config.networks[networkKey];
      return { label: network.name, value: network.id, icon: network.icon };
    });
  }, [wallet?.getNework()]);

  const CURRENCY_OPTIONS = useMemo((): {
    label: string,
    value: string,
    icon: string | undefined,
    decimals: number
  }[] => {
    if (!wallet) {
      return [];
    }
    const networkCurrencies = config.networks[wallet.getNework()].currencies;
    return Object.keys(networkCurrencies).map(currencyKey => {
      const currency = networkCurrencies[currencyKey];
      return { label: currency.name, value: currency.address, icon: currency.icon, decimals: currency.decimals };
    });
  }, [wallet?.getNework()]);

  const onChangeCurrency = (currencyAddress: string) => {
    setDataForm(prevState => ({ ...prevState, currencyAddress }));
  };

  const approveToken = async (
    network: string,
    currencyAddress: string,
    walletAddress: string,
    contractAddress: string
  ) => {
    const isApproved = await isTokenApproved(
      network,
      currencyAddress,
      walletAddress,
      contractAddress
    );
    if (isApproved) {
      return;
    }
    toastInfo({ message: 'You need to give permission to access your token' });
    await dispatch(executeTransaction({
      provider: wallet?.getProvider(),
      params: {
        contractAddress: currencyAddress,
        abi: abi['erc20'],
        action: 'approve',
        transactionArgs: [contractAddress, MaxUint256.toString()],
      }
    }));
  }

  const onTopUp = async () => {
    const { currencyAddress, amount } = dataForm;
    if (!wallet || !amount) {
      return;
    }
    try {
      setTopUpStatus(TOP_UP_STATUS.PENDING);
      const topUpContractAddress = config.networks[dataForm.chainId].addresses.topup;
      await approveToken(
        wallet.getNework(),
        currencyAddress,
        wallet.getAddress(),
        topUpContractAddress
      );
      const currencyDecimal = CURRENCY_OPTIONS.find(item => item.value === currencyAddress)?.decimals;
      await dispatch(executeTransaction({
        provider: wallet.getProvider(),
        params: {
          contractAddress: topUpContractAddress,
          abi: abi['billing'],
          action: 'topup',
          transactionArgs: [TOP_UP_APP_ID, currencyAddress, convertDecToWei(amount, currencyDecimal)]
        },
        confirmation: TOP_UP_CONFIRMATIONS
      }));
      dispatch(getInfoUser());
      setTopUpStatus(TOP_UP_STATUS.FINISHED);
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
      <Box>
        When payment is completed, Continue button would be available.
      </Box>
    );
  };

  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Crypto</Box>
      </Flex>
      <AppCard className={'box-form-crypto'}>
        <Flex
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          alignItems={'flex-end'}
        >
          <AppField label={'Linked Wallet'} customWidth={'100%'}>
            <Flex
              flexWrap={'wrap'}
              justifyContent={'space-between'}
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <Box width={isMobile ? '100%' : 'calc(100% - 175px)'}>
                <AppInput
                  isDisabled={true}
                  size="lg"
                  value={dataForm.walletAddress}
                />
              </Box>
              <Box width={isMobile ? '100%' : '165px'} mt={isMobile ? 4 : 0}>
                <AppConnectWalletButton
                  width={'100%'}
                  size="lg"
                >
                  Connect Wallet
                </AppConnectWalletButton>
              </Box>
            </Flex>
          </AppField>
          {wallet && (
            <Flex
              flexWrap={'wrap'}
              justifyContent={'space-between'}
              alignItems={'flex-end'}
            >
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
              <Box width={isMobile ? '100%' : '49.5%'}>
                <AppField label={'Currency'} customWidth={'100%'}>
                  <AppSelect2
                    size="large"
                    onChange={(value: string) => onChangeCurrency(value)}
                    options={CURRENCY_OPTIONS}
                    value={dataForm.currencyAddress}
                  />
                </AppField>
              </Box>
              <AppField label={'Amount'} customWidth={'49%'}>
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
                />
              </AppField>
            </Flex>
          )}
        </Flex>
      </AppCard>
      {_renderTopUpMessage()}
      {wallet && (
        <Flex justifyContent={isMobile ? 'center' : 'flex-end'} mt={7}>
          <AppButton
            size={'lg'}
            onClick={topUpStatus === TOP_UP_STATUS.NONE ? onTopUp : onNext}
            disabled={topUpStatus === TOP_UP_STATUS.PENDING}
          >
            {topUpStatus === TOP_UP_STATUS.NONE ? 'Top Up' : 'Continue'}
          </AppButton>
        </Flex>
      )}
    </Box>
  );
};

export default FormCrypto;
