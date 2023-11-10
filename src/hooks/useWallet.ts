import { BaseProvider, Web3Provider } from '@ethersproject/providers';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from 'src/config';
import ConnectorFactory, { WALLET_CONNECT } from 'src/connectors';
import BaseConnector from 'src/connectors/BaseConnector';
import rf from 'src/requests/RequestFactory';
import { RootState } from 'src/store';
import { getUserProfile } from 'src/store/user';
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
import { getChainByChainId, switchNetwork } from 'src/utils/utils-network';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import Storage from 'src/utils/utils-storage';
import { IWallet, Wallet } from 'src/utils/utils-wallet';
import web3 from 'web3';
import useUser from './useUser';

type ReturnType = {
  currentNetwork: string;
  wallet: IWallet | null;
  isOpenModalConnectWallet: boolean;
  isUserLinked: boolean;
  connectWallet: (connectorId: string, network: string) => Promise<void>;
  disconnectWallet: () => void;
  linkWallet: (connector: BaseConnector, address: string) => Promise<void>;
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

  const _onAccountsChanged = async (changedAccount: string) => {
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
    await connectWallet(connectorId, network, changedAccount);
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
      await _onAccountsChanged(changedAccount);
    });
  };

  const connectWallet = async (
    connectorId: string,
    network: string,
    connectedAccount?: string,
  ) => {
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

      let account = '';
      if (connectedAccount) {
        // used when change account
        const listedAccounts = await connector.getAccounts();
        if (
          listedAccounts.some(
            (account: string) =>
              account.toLowerCase() === connectedAccount.toLowerCase(),
          )
        ) {
          account = connectedAccount;
          connector.account = connectedAccount;
        }
      } else {
        account = await connector.getAccount(provider);
      }
      if (!account) {
        throw new Error('Not found connected account from provider');
      }
      dispatch(setAddress(account));
      dispatch(setNetwork(network));
      dispatch(getBalance());

      _saveProvider(provider);
      dispatch(setIsConnecting(false));
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

  const linkWallet = async (connector: BaseConnector, address: string) => {
    try {
      const signature = await connector.signMessage();
      await rf
        .getRequest('AuthRequest')
        .attachWalletAddress({ address, signature });
      // reload user's info
      dispatch(getUserProfile());
      toastSuccess({ message: 'Link wallet successfully!' });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const unlinkWallet = async () => {
    try {
      await rf.getRequest('AuthRequest').unlinkWallet();
      // reload user's info
      dispatch(getUserProfile());
      disconnectWallet();
      toastSuccess({ message: 'Unlink wallet successfully!' });
    } catch (error) {
      console.error(error);
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
    isUserLinked: !!user?.isUserLinked(),
    connectWallet,
    disconnectWallet,
    linkWallet,
    unlinkWallet,
    changeNetwork,
    reloadBalance,
    toggleModalConnectWallet,
  };
};

export default useWallet;
