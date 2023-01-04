import { useDispatch } from 'react-redux';
import { MaxUint256 } from '@ethersproject/constants';
import abi from 'src/abi';
import { executeTransaction } from 'src/store/transaction';
import { toastInfo } from 'src/utils/utils-notify';
import { isTokenApproved } from 'src/utils/utils-token';
import useWallet from 'src/hooks/useWallet';
import config from 'src/config';
import { getChainConfig, getNetworkByEnv } from 'src/utils/utils-network';
import { convertDecToWei } from 'src/utils/utils-format';
import { getUserProfile } from 'src/store/user';

type ReturnType = {
  approveToken: (
    contractAddress: string,
    currencyAddress: string,
  ) => Promise<void>;
  topUp: (currencyAddress: string, amount: string) => Promise<void>;
};

const useTopUp = (): ReturnType => {
  const dispatch = useDispatch();
  const { wallet } = useWallet();

  const TOP_UP_APP_ID = 1; // used for blockSniper
  const TOP_UP_CONFIRMATIONS = 30;

  const approveToken = async (
    contractAddress: string,
    currencyAddress: string,
  ) => {
    if (!wallet) {
      return;
    }
    const isApproved = await isTokenApproved(
      wallet.getNework(),
      currencyAddress,
      wallet.getAddress(),
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

  const topUp = async (currencyAddress: string, amount: string) => {
    if (!wallet) {
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
    const topUpContractAddress =
      config.topUp[wallet.getNework()].contractAddress;
    await approveToken(topUpContractAddress, currencyAddress);
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
            convertDecToWei(amount, networkCurrencies[currencyKey].decimals),
          ],
        },
        confirmation: TOP_UP_CONFIRMATIONS,
      }),
    );
    await dispatch(getUserProfile());
  };

  return {
    approveToken,
    topUp,
  };
};

export default useTopUp;
