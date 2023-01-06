import {
  BaseProvider,
  FallbackProvider,
  StaticJsonRpcProvider,
  JsonRpcProvider,
} from '@ethersproject/providers';
import _ from 'lodash';
import config, { Chain, Network } from 'src/config';
import { toastError } from './utils-notify';

export const CHAINS = {
  ETH: 'ETH',
  BSC: 'BSC',
  POLYGON: 'POLYGON',
  BTC: 'BTC',
};

export const getLogoChainByChainId = (ChainId?: string) => {
  if (!ChainId) return;
  return config.chains[ChainId].icon;
};

export const getNameChainByChainId = (ChainId?: string) => {
  if (!ChainId) return '--';
  return config.chains[ChainId].name;
};

export const isEVMNetwork = (chainId?: string) => {
  if (!chainId) return false;
  return chainId !== CHAINS.BTC;
};

export const getBlockExplorerUrl = (chainId?: string, networkId?: string) => {
  if (!chainId || !networkId) {
    return '';
  }
  const chain = config.chains[chainId];
  const network = chain.networks[networkId];
  return network?.blockExplorer.url || '';
};

export const getChainByChainId = (chainId: string | number): Chain | null => {
  const chainKeys = Object.keys(config.chains);
  const chainKey = chainKeys.find((chainKey) => {
    const chain = config.chains[chainKey];
    const networkKeys = Object.keys(chain.networks);
    return networkKeys.some(
      (networkKey) =>
        String(chain.networks[networkKey].chainId) === String(chainId),
    );
  });
  if (!chainKey) {
    return null;
  }
  return config.chains[chainKey];
};

export const getChainConfig = (networkId: string | undefined): Chain => {
  const defaultChain = config.chains[config.defaultNetwork];
  if (!networkId) {
    return defaultChain;
  }
  return config.chains[networkId] || defaultChain;
};

export const getNetworkByEnv = (chain: Chain | null): Network => {
  const env = process.env.REACT_APP_ENV || 'prod';
  const networks: any = {
    ETH: {
      prod: 'MAINNET',
      dev: 'GOERLI',
    },
    BSC: {
      prod: 'MAINNET',
      dev: 'TESTNET',
    },
    POLYGON: {
      prod: 'MAINNET',
      dev: 'MUMBAI',
    },
  };
  const defaultChain = getChainConfig(config.defaultNetwork);
  const defaultNetworkByEnv =
    defaultChain.networks[networks[defaultChain.id][env]];
  if (!chain) {
    return defaultNetworkByEnv;
  }
  return chain.networks[networks[chain.id][env]];
};

export const getNetworkProvider = (network = ''): FallbackProvider => {
  network = network ? network : config.defaultNetwork;
  const chainConfig = getChainConfig(network);
  if (!chainConfig) {
    console.error(
      `[getNetworkProvider] throw error: networkConfig ${network} not found`,
    );
  }
  const rpcUrls = _.shuffle(getNetworkByEnv(chainConfig).rpcUrls);

  const providers: {
    provider: BaseProvider;
    priority: number;
    stallTimeout: number;
  }[] = [];
  rpcUrls.forEach((rpcUrl, index) => {
    const provider: BaseProvider = new StaticJsonRpcProvider(
      rpcUrl,
      getNetworkByEnv(chainConfig).chainId,
    );
    const priority = index + 1;
    providers.push({
      provider,
      priority,
      stallTimeout: 4000 + 100 * priority,
    });
  });

  return new FallbackProvider(providers, 1);
};

export const switchNetwork = async (
  network: string,
  provider: JsonRpcProvider | null | undefined,
) => {
  if (!provider) {
    throw new Error('[Switch Network] No provider was found');
  }
  const chainId = getNetworkByEnv(getChainConfig(network)).chainId;
  if (!chainId) {
    throw new Error('[Switch Network] No chainId was found');
  }
  try {
    await provider.send('wallet_switchEthereumChain', [
      {
        chainId: `0x${chainId.toString(16)}`,
      },
    ]);
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    // TODO: change 4902 to constant variable
    if (error.code === 4902 || error.code === -32603) {
      toastError({
        message: 'Please add this network to your wallet to continue',
      });
      return addNewNetwork(network, provider);
    }
    // 4001: User rejected to switch network
    return new Promise((resolve, reject) => reject(error));
  }
};

const addNewNetwork = (network: string, provider: JsonRpcProvider) => {
  try {
    const networkConfig = getNetworkByEnv(getChainConfig(network));
    if (!networkConfig) {
      return;
    }
    const { chainId, name, nativeCurrency, rpcUrls, blockExplorer } =
      networkConfig;
    return provider.send('wallet_addEthereumChain', [
      {
        chainId: `0x${chainId.toString(16)}`,
        chainName: name,
        nativeCurrency,
        rpcUrls,
        blockExplorerUrls: [blockExplorer.url],
      },
    ]);
  } catch (error: any) {
    console.error(`[AddNewNetwork] throw exception: ${error.message}`, error);
    throw error;
  }
};
