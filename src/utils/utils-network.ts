import config from 'src/config';

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
