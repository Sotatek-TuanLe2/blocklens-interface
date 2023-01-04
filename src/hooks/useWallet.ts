import { BaseProvider, Web3Provider } from '@ethersproject/providers';
import web3 from 'web3';
import _ from 'lodash';
import ConnectorFactory, { WALLET_CONNECT } from 'src/connectors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/store';
import {
  clearWallet,
  getBalance,
  setAddress,
  setConnector,
  setIsConnecting,
  setNetwork,
  setOpenModalConnectWallet,
  setProvider,
} from 'src/store/wallet';
import config from 'src/config';
import { getChainByChainId, switchNetwork } from 'src/utils/utils-network';
import { useMemo } from 'react';
import {
  IWallet,
  Wallet,
} from 'src/utils/utils-wallet';
import Storage from 'src/utils/utils-storage';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseConnector from 'src/connectors/BaseConnector';
import useUser from './useUser';
import rf from 'src/requests/RequestFactory';
import { getUserProfile } from 'src/store/user';

type ReturnType = {
  currentNetwork: string;
  wallet: IWallet | null;
  isOpenModalConnectWallet: boolean;
  isUserLinked: boolean;
  connectWallet: (connectorId: string, network: string) => Promise<void>;
  disconnectWallet: () => void;
  unlinkWallet: () => void;
  changeNetwork: (network: string) => Promise<void>;
  reloadBalance: () => Promise<void>;
  toggleModalConnectWallet: (isOpen: boolean) => void;
};

const useWallet = (): ReturnType => {
  const dispatch = useDispatch();
  const {
    network,
    chainId,
    connector,
    provider,
    address,
    balance,
    openModalConnectWallet,
  } = useSelector((state: RootState) => state.wallet);

  const { user } = useUser();

  const wallet = useMemo(() => {
    if (!address) {
      return null;
    }
    const newWallet = new Wallet(address);
    newWallet.setNetwork(network);
    newWallet.setChainId(chainId);
    newWallet.setConnector(connector);
    newWallet.setProvider(provider);
    newWallet.setBalance(balance);
    return newWallet;
  }, [network, chainId, connector, provider, address, balance]);

  const _onChainChanged = async (hexChainId: string) => {
    const chainId = web3.utils.hexToNumber(hexChainId);
    const selectedChain = getChainByChainId(chainId);
    if (!selectedChain) {
      console.error('[onChainChanged] throw warning: Not found network');
      return;
    }
    const connectorId = Storage.getConnectorId() || '';
    if (!connectorId) {
      console.error('[onChainChanged] throw warning: Not found connector');
      return;
    }
    await connectWallet(connectorId, selectedChain.id);
  };

  const _onAccountsChanged = async () => {
    const connectorId = Storage.getConnectorId() || '';
    const network = Storage.getNetwork();
    if (!connectorId) {
      console.error(
        '[onAccountedChange] throw warning: Not found connector',
        'connectorId:',
        connectorId,
        'network:',
        network,
      );
      return;
    }
    await connectWallet(connectorId, network);
  };

  const _saveProvider = (provider: BaseProvider) => {
    dispatch(setProvider(provider));
    if (provider.removeAllListeners) {
      provider.removeAllListeners();
    }
    if (!provider.on) {
      return;
    }
    provider.on('chainChanged', async (hexChainId: string) => {
      await _onChainChanged(hexChainId);
    });
    provider.on('accountsChanged', async ([changedAccount]: [string]) => {
      const connectorId = Storage.getConnectorId() || '';
      if (connectorId === WALLET_CONNECT) {
        const accountAddress = Storage.getAccountAddress() || '';
        if (changedAccount === accountAddress) {
          return;
        }
      }
      await _onAccountsChanged();
    });
  };

  const signMessage = async (connector: BaseConnector, address: string) => {
    try {
      if (!user || !!user.isUserLinked() || !address) {
        return;
      }
      const signature = await connector.signMessage();
      await rf
        .getRequest('AuthRequest')
        .attachWalletAddress({ address, signature });
      // reload user's info
      dispatch(getUserProfile());
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const connectWallet = async (connectorId: string, network: string) => {
    const connector = ConnectorFactory.getConnector(connectorId, network);
    if (!connector) {
      return;
    }
    dispatch(setIsConnecting(true));
    try {
      const provider = await connector.connect();
      if (!provider) {
        throw new Error('No provider was found');
      }
      dispatch(setConnector(connector));

      const account = await connector.getAccount(provider);
      if (!account) {
        throw new Error('Not found connected account from provider');
      }
      dispatch(setAddress(account));
      dispatch(setNetwork(network));
      dispatch(getBalance());

      _saveProvider(provider);
      dispatch(setIsConnecting(false));
      await signMessage(connector, account);
    } catch (error: any) {
      dispatch(setIsConnecting(false));
      disconnectWallet();
      console.error(`[ConnectWallet] throw exception: ${error.message}`, error);
      throw error;
    } finally {
      dispatch(setIsConnecting(false));
    }
  };

  const disconnectWallet = () => {
    dispatch(clearWallet());
  };

  const unlinkWallet = async () => {
    try {
      await rf.getRequest('AuthRequest').unlinkWallet();
      // reload user's info
      dispatch(getUserProfile());
      disconnectWallet();
      toastSuccess({ message: 'Unlink wallet successfully!' });
    } catch (error: any) {
      toastError({ message: error.message });
    }
  };

  const changeNetwork = async (network: string) => {
    if (!provider) {
      return;
    }
    const connectorId = Storage.getConnectorId() || '';
    const options = config.connectors[connectorId].options[network];
    if (!options) {
      toastError({
        message: `This wallet does not support ${network} network`,
      });
      return;
    }
    return switchNetwork(network, new Web3Provider(provider));
  };

  const reloadBalance = async () => {
    if (!wallet) {
      return;
    }
    dispatch(getBalance());
  };

  const toggleModalConnectWallet = (isOpen: boolean) => {
    dispatch(setOpenModalConnectWallet(isOpen));
  };

  return {
    currentNetwork: network,
    wallet,
    isOpenModalConnectWallet: openModalConnectWallet,
    isUserLinked: !!wallet && !!user?.isUserLinked(),
    connectWallet,
    disconnectWallet,
    unlinkWallet,
    changeNetwork,
    reloadBalance,
    toggleModalConnectWallet,
  };
};

export default useWallet;
