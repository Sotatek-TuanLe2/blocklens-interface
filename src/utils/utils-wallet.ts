import { ExternalProvider } from '@ethersproject/providers';
import { isChrome, isEdge, isFirefox } from 'react-device-detect';
import BaseConnector from 'src/connectors/BaseConnector';
import config from 'src/config';

export interface IWallet {
  network: string;
  chainId: string;
  connector: BaseConnector | null;
  provider: ExternalProvider | null;
  address: string;
  balance: string;

  setNetwork: (network: string) => void;
  setChainId: (chainId: string) => void;
  setConnector: (connector: BaseConnector | null) => void;
  setProvider: (provider: ExternalProvider | null) => void;
  setAddress: (address: string) => void;
  setBalance: (balance: string) => void;
  getNework: () => string;
  getChainId: () => string;
  getConnector: () => BaseConnector | null;
  getProvider: () => ExternalProvider | null;
  getAddress: () => string;
  getBalance: () => string;
  getConnectorId: () => string;
  isConnected: () => boolean;
}

export class Wallet implements IWallet {
  public network = '';
  public chainId = '';
  public connector: BaseConnector | null = null;
  public provider: ExternalProvider | null = null;
  public address = '';
  public balance = '';

  constructor(address: string) {
    this.address = address;
  }

  setNetwork(network: string) {
    this.network = network;
  }

  setChainId(chainId: string) {
    this.chainId = chainId;
  }

  setConnector(connector: BaseConnector | null) {
    this.connector = connector;
  }

  setProvider(provider: ExternalProvider | null) {
    this.provider = provider;
  }

  setAddress(address: string) {
    this.address = address;
  }

  setBalance(balance: string) {
    this.balance = balance;
  }

  getNework() {
    return this.network;
  }

  getChainId() {
    return this.chainId;
  }

  getConnector() {
    return this.connector;
  }

  getProvider() {
    return this.provider;
  }

  getAddress() {
    return this.address;
  }

  getBalance() {
    return this.balance;
  }

  getConnectorId() {
    if (!this.connector) {
      return '';
    }
    return this.connector.getId();
  }

  isConnected() {
    return !!this.getAddress();
  }
}

export const shortenWalletAddress = (walletAddress: string) => {
  if (!walletAddress) return '';
  return (
    walletAddress.slice(0, 8) +
    '...' +
    walletAddress.slice(walletAddress.length - 5, walletAddress.length)
  );
};

export const navigateToWalletInstallation = (
  network: string,
  wallet: string,
) => {
  let walletInstallationURL = '';
  if (isChrome) {
    walletInstallationURL =
      config.networks[network].connectors[wallet].extensionLink?.chrome || '';
  } else if (isFirefox) {
    walletInstallationURL =
      config.networks[network].connectors[wallet].extensionLink?.firefox || '';
  } else if (isEdge) {
    walletInstallationURL =
      config.networks[network].connectors[wallet].extensionLink?.edge || '';
  }
  if (!walletInstallationURL) {
    return;
  }
  // open wallet installation in new tab
  window.open(walletInstallationURL, '_blank')?.focus();
};

export const checkWalletConnectProvider = (
  provider: any,
): { isValid: boolean; message?: string } => {
  const providerChainId = provider.chainId;
  if (provider.rpc[providerChainId]) {
    return { isValid: true };
  }
  return {
    isValid: false,
    message:
      'You are connecting with wrong network. Please switch to the correct network and connect again!',
  };
};
