import {
  BaseProvider,
  FallbackProvider,
  JsonRpcProvider,
  StaticJsonRpcProvider,
} from '@ethersproject/providers';
import _ from 'lodash';
import config, { Chain, Network } from 'src/config';
import { CHAIN_NAME } from './query.type';
import { toastError } from './utils-notify';
import { CHAINS } from './utils-webhook';

export const getLogoChainByChainId = (ChainId?: string) => {
  if (!ChainId) return;
  return config.chains[ChainId]?.icon || '';
};

export const getNameChainByChainId = (chainId?: string) => {
  if (!chainId) return '--';
  return config.chains[chainId]?.name || chainId;
};

export const isEVMNetwork = (chainId?: string) => {
  if (!chainId) return false;
  return config.chains[chainId]?.family === CHAINS.ETH
    || config.chains[chainId]?.family === CHAINS.AVAX;
};

export const isAptosNetwork = (chainId?: string) => {
  if (!chainId) return false;
  return chainId === CHAINS.APTOS;
};

export const isSuiNetwork = (chainId?: string) => {
  if (!chainId) return false;
  return chainId === CHAINS.SUI;
};

export const getExplorerTxUrl = (
  chainId?: string,
  networkId?: string,
  txHash?: string,
) => {
  if (!chainId || !networkId || !txHash) {
    return '';
  }

  const chain = config.chains[chainId];
  const networkKey = objectKeys(chain.networks).find(
    (key) => chain.networks[key].id === networkId,
  );

  if (networkKey) {
    return `${chain.networks[networkKey].blockExplorer.url}/${txHash}`;
  }

  return '';
};

export const objectKeys = (obj: any) => {
  return Object.keys(obj);
};

export const getChains: (filter?: (chain: Chain) => boolean) => {
  label: string;
  value: string;
  icon: string;
  networks: { [key: string]: Network };
}[] = (filter) => {
  return objectKeys(config.chains)
    .filter((chainId) => (filter ? filter(config.chains[chainId]) : true))
    .map((chainKey) => {
      const chain = config.chains[chainKey];
      return {
        label: chain.name,
        value: chain.id,
        icon: chain.icon,
        networks: chain.networks,
      };
    });
};

export const getSupportChainsTopUp = () => {
  const supportChainsName = objectKeys(config.topUp.supportChains);
  return getChains((chain) => supportChainsName.includes(chain.id));
};

export const getTopUpCurrencies = () => {
  const supportTopUpChainConfigKeys = objectKeys(config.topUp.supportChains);
  return supportTopUpChainConfigKeys.map(
    (key) => config.topUp.supportChains[key].currencies,
  );
};

export const getTopUpCurrenciesByChainId = (chainId: string) => {
  const supportChain = config.topUp.supportChains[chainId];
  if (!supportChain) return [];
  const currencyKeys = objectKeys(supportChain.currencies);
  return currencyKeys.map((key) => supportChain.currencies[key]);
};

export const getTopUpCurrencyOptions = (chainId: string) => {
  return getTopUpCurrenciesByChainId(chainId).map((currency) => ({
    label: currency.name,
    value: currency.address,
    icon: currency.icon,
    decimals: currency.decimals,
  }));
};

export const getTopUpConfigByNetworkId = (networkId: string) => {
  return config.topUp.supportChains[networkId];
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

export const getNetworkConfig = (networkId?: string): Network => {
  const defaultNetwork = config.networks[config.defaultNetwork];
  if (!networkId) {
    return defaultNetwork;
  }
  return config.networks[networkId];
};

export const getNetworkProvider = (network = ''): FallbackProvider => {
  network = network ? network : config.defaultNetwork;
  const networkConfig = getNetworkConfig(network);
  if (!networkConfig) {
    console.error(
      `[getNetworkProvider] throw error: networkConfig ${network} not found`,
    );
  }
  const rpcUrls = _.shuffle(networkConfig.rpcUrls);

  const providers: {
    provider: BaseProvider;
    priority: number;
    stallTimeout: number;
  }[] = [];
  rpcUrls.forEach((rpcUrl, index) => {
    const provider: BaseProvider = new StaticJsonRpcProvider(
      rpcUrl,
      networkConfig.chainId,
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
  const chainId = getNetworkConfig(network).chainId;
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
    return new Promise((_resolve, reject) => reject(error));
  }
};

const addNewNetwork = (network: string, provider: JsonRpcProvider) => {
  try {
    const networkConfig = getNetworkConfig(network);
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

export const getChainIconByChainName = (chainName: string) => {
  let iconClassName: string;
  const listChainName = [
    CHAIN_NAME.ETH_GOERLI,
    CHAIN_NAME.ETH_MAINNET,
    CHAIN_NAME.BSC_TESTNET,
    CHAIN_NAME.BSC_MAINNET,
    CHAIN_NAME.APTOS_TESTNET,
    CHAIN_NAME.APTOS_MAINNET,
    CHAIN_NAME.polygon_mumbai,
    CHAIN_NAME.POLYGON_MAINNET,
    CHAIN_NAME.OPTIMISM_MAINET,
    CHAIN_NAME.OPTIMISM_TESTNET,
    CHAIN_NAME.SOLANA_MAINET,
    CHAIN_NAME.SOLANA_TESTNET,
    CHAIN_NAME.ARBITRUM_MAINET,
    CHAIN_NAME.ARBITRUM_TESTNET,
    CHAIN_NAME.SUI_MAINET,
    CHAIN_NAME.SUI_TESTNET,
  ];

  const chainNameValue = listChainName.find((item) => chainName.includes(item));

  switch (chainNameValue) {
    case CHAIN_NAME.ETH_GOERLI:
    case CHAIN_NAME.ETH_MAINNET: {
      iconClassName = getLogoChainByChainId('ETH') || '';
      break;
    }
    case CHAIN_NAME.BSC_TESTNET:
    case CHAIN_NAME.BSC_MAINNET: {
      iconClassName = getLogoChainByChainId('BSC') || '';
      break;
    }
    case CHAIN_NAME.APTOS_MAINNET:
    case CHAIN_NAME.APTOS_TESTNET:
      iconClassName = 'icon-aptos';
      break;
    case CHAIN_NAME.OPTIMISM_MAINET:
    case CHAIN_NAME.OPTIMISM_TESTNET:
      iconClassName = 'icon-optimism';
      break;
    case CHAIN_NAME.SOLANA_MAINET:
    case CHAIN_NAME.SOLANA_TESTNET:
      iconClassName = 'icon-solana';
      break;
    case CHAIN_NAME.ARBITRUM_MAINET:
    case CHAIN_NAME.ARBITRUM_TESTNET:
      iconClassName = 'icon-arbitrum';
      break;
    case CHAIN_NAME.SUI_MAINET:
    case CHAIN_NAME.SUI_TESTNET:
      iconClassName = 'icon-sui';
      break;
    default:
      iconClassName = getLogoChainByChainId('POLYGON') || '';
      break;
  }
  return iconClassName;
};

export const getChainIconInactiveByChainName = (chainName: string) => {
  let iconClassName: string;

  switch (chainName) {
    case CHAIN_NAME.ETH_GOERLI:
    case CHAIN_NAME.ETH_MAINNET: {
      iconClassName = 'icon-ethereum-inactive';
      break;
    }
    case CHAIN_NAME.BSC_TESTNET:
    case CHAIN_NAME.BSC_MAINNET: {
      iconClassName = 'icon-bsc-inactive';
      break;
    }
    case CHAIN_NAME.APTOS_MAINNET:
    case CHAIN_NAME.APTOS_TESTNET:
      iconClassName = 'icon-aptos-inactive';
      break;
    case CHAIN_NAME.OPTIMISM_MAINET:
    case CHAIN_NAME.OPTIMISM_TESTNET:
      iconClassName = 'icon-optimism-inactive';
      break;
    case CHAIN_NAME.SOLANA_MAINET:
    case CHAIN_NAME.SOLANA_TESTNET:
      iconClassName = 'icon-solana-inactive';
      break;
    case CHAIN_NAME.ARBITRUM_MAINET:
    case CHAIN_NAME.ARBITRUM_TESTNET:
      iconClassName = 'icon-arbitrum-inactive';
      break;
    case CHAIN_NAME.SUI_MAINET:
    case CHAIN_NAME.SUI_TESTNET:
      iconClassName = 'icon-sui-inactive';
      break;
    default:
      iconClassName = 'icon-polygon-inactive';
      break;
  }
  return iconClassName;
};
