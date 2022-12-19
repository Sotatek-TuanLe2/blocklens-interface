import {
  BaseProvider,
  FallbackProvider,
  StaticJsonRpcProvider,
  JsonRpcProvider,
} from '@ethersproject/providers';
import _ from 'lodash';
import config from 'src/config';
import { toastError } from './utils-notify';
import Storage from './utils-storage';

export const CHAINS = {
  ETH: 'ETH',
  BSC: 'BSC',
  POLYGON: 'POLYGON',
  BITCOIN: 'BITCOIN',
};

export const getLogoChainByName = (chainName?: string) => {
  if (!chainName) return;
  return config.chains.filter((chain) => chain.id === chainName)[0]?.icon;
};

export const getNameChainByChainId = (ChainId?: string) => {
  if (!ChainId) return '--';
  return config.chains.filter((chain) => chain.id === ChainId)[0]?.name;
};

export const isEVMNetwork = (chainId?: string) => {
  if (!chainId) return false;
  return chainId !== CHAINS.BITCOIN;
};

export const getBlockExplorerUrl = (chainId?: string, networkId?: string) => {
  const chain = config.chains.find((chain) => chain.id === chainId);
  const network = chain?.networks.find((item) => item.id === networkId);
  return network?.blockExplorerUrl || '';
};

export const getNetworkConfig = (networkId: string | undefined) => {
  if (!networkId) {
    return null;
  }
  const network =
    config.networks[networkId] ||
    _.find(
      config.networks,
      (network) => network.id.toUpperCase() === networkId.toUpperCase(),
    );
  if (!network) {
    return null;
  }
  return network;
};

export const getNetworkProvider = (network = ''): FallbackProvider => {
  network = network ? network : config.defaultNetwork;
  const networkConfig = getNetworkConfig(network);
  if (!networkConfig) {
    console.error(
      `[getNetworkProvider] throw error: networkConfig ${network} not found`,
    );
  }
  const rpcUrls = _.shuffle(networkConfig?.rpcUrls);

  const providers: {
    provider: BaseProvider;
    priority: number;
    stallTimeout: number;
  }[] = [];
  rpcUrls.forEach((rpcUrl, index) => {
    const provider: BaseProvider = new StaticJsonRpcProvider(
      rpcUrl,
      networkConfig?.chainId,
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
  const chainId = config.networks[network].chainId;
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
      toastError({ message: 'Please add this network to your wallet to continue' });
      return addNewNetwork(network, provider);
    }
    // 4001: User rejected to switch network
    return new Promise((resolve, reject) => reject(error.message));
  }
};

const addNewNetwork = (network: string, provider: JsonRpcProvider) => {
  try {
    const { chainId, name, nativeCurrency, rpcUrls, blockExplorer } =
      config.networks[network];
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
