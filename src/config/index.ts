/* eslint-disable @typescript-eslint/no-explicit-any */
import prod from './prod.json';
import dev from './dev.json';
import preprod from './preprod.json';

const env = process.env.REACT_APP_ENV || 'prod';
const configs: any = {
  prod,
  dev,
  preprod,
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
  family: string;
  name: string;
  id: string;
  icon: string;
  networks: { [key: string]: Network };
}

export type ChainTopUpConfigType = {
  contractAddress: string;
  currencies: {
    [key: string]: Currency;
  };
};

export interface Config {
  auth: {
    domain: string;
    message: string;
    secretKey: string;
    googleClientId: string;
    reCaptchaKey: string;
  };
  api: {
    baseUrlApi: string;
    notificationsApi: string;
    authApi: string;
    dashboard: string;
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
    supportChains: {
      [key: string]: ChainTopUpConfigType;
    };
    appId: number;
    confirmations: number;
  };
  connectors: {
    [key: string]: Connector;
  };
  networks: {
    [key: string]: Network;
  };
}

export default config;
