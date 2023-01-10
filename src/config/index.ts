/* eslint-disable @typescript-eslint/no-explicit-any */
import prod from './prod.json';
import dev from './dev.json';

const env = process.env.REACT_APP_ENV || 'prod';
const configs: any = {
  prod,
  dev,
};
const config: Config = configs[env];

interface BlockExplorer {
  name: string;
  icon: string;
  url: string;
}

interface Connector {
  id: string;
  name: string;
  icon: string;
  description: string;
  href: string;
  mobile: boolean;
  deepLink: string;
  options: {
    [key: string]: any;
  };
  extensionLink?: {
    chrome: string;
    firefox: string;
    brave: string;
    edge: string;
  };
}

interface Currency {
  id: string;
  coingeckoId: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
}

export interface Network {
  name: string;
  id: string;
  icon: string;
  chainId: number;
  rpcUrls: string[];
  blockExplorer: BlockExplorer;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  currencies: {
    [key: string]: Currency;
  };
}

export interface Chain {
  name: string;
  id: string;
  icon: string;
  networks: { [key: string]: Network };
  allowTopUp: boolean;
}

export interface TopUp {
  contractAddress: string;
}

export interface Config {
  auth: {
    domain: string;
    message: string;
    secretKey: string;
    googleClientId: string;
  };
  api: {
    baseUrlApi: string;
    notificationsApi: string;
  };
  defaultNetwork: string;
  defaultChainId: number;
  stripe: {
    publishableKey: string;
  };
  chains: {
    [key: string]: Chain;
  };
  multicall: {
    [key: string]: string;
  };
  topUp: {
    chains: {
      [key: string]: TopUp;
    };
    topUpAppId: number;
    topUpConfirmations: number;
  };
  connectors: {
    [key: string]: Connector;
  };
  networks: {
    [key: string]: Network;
  };
}

export default config;
