import { Box, Flex } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import 'src/styles/pages/AppDetail.scss';
import { AppButton, AppCard } from 'src/components';
import { isMobile } from 'react-device-detect';
import AppConnectWalletButton from 'src/components/AppConnectWalletButton';
import useWallet from 'src/hooks/useWallet';
import { toastError } from 'src/utils/utils-notify';
import useUser from 'src/hooks/useUser';
import { ConnectWalletIcon } from 'src/assets/icons';
import AppAlertWarning from 'src/components/AppAlertWarning';
import { getChainConfig, getNetworkByEnv } from 'src/utils/utils-network';
import { IPlan } from 'src/store/billing';
import useTopUp from 'src/hooks/useTopUp';
import AppCryptoForm from 'src/components/AppCryptoForm';

interface IFormCrypto {
  onNext: () => void;
  planSelected: IPlan;
}

interface IDataForm {
  walletAddress: string;
  chainId: string;
  currencyAddress: string;
  amount: string;
}

const FormCrypto: FC<IFormCrypto> = ({ onNext, planSelected }) => {
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

  const [dataForm, setDataForm] = useState<IDataForm>(initialDataForm);
  const [topUpStatus, setTopUpStatus] = useState<number>(TOP_UP_STATUS.NONE);
  const [isSufficientBalance, setIsSufficientBalance] =
    useState<boolean>(false);
  const { wallet, isUserLinked } = useWallet();
  const { user } = useUser();
  const { topUp } = useTopUp();

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
    if (user?.getBalance() && planSelected) {
      if (
        new BigNumber(user.getBalance()).isGreaterThanOrEqualTo(
          new BigNumber(planSelected.price || 0),
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

  const onChangeCurrency = (currencyAddress: string) => {
    setDataForm((prevState) => ({ ...prevState, currencyAddress }));
  };

  const onTopUp = async () => {
    const { currencyAddress, amount } = dataForm;
    if (!wallet || !amount) {
      return;
    }
    try {
      setTopUpStatus(TOP_UP_STATUS.PENDING);
      await topUp(currencyAddress, amount);
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

  const _renderWalletInfo = () => (
    <>
      {!isSufficientBalance && (
        <Box width={'100%'}>
          <AppAlertWarning>
            Your current balance is insufficent. Please top-up to meet the
            plan's price!
          </AppAlertWarning>
        </Box>
      )}
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
          <AppConnectWalletButton width={'100%'} size="lg">
            Connect Wallet
          </AppConnectWalletButton>
        </AppCard>
      )}
    </Box>
  );
};

export default FormCrypto;
