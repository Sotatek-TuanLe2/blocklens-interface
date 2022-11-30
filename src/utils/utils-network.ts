import config from 'src/config';

export const CHAINS = {
  ETHEREUM: 'ETHEREUM',
  BSC: 'BSC',
  POLYGON: 'POLYGON',
  SOLANA: 'SOLANA',
  BITCOIN: 'BITCOIN',
};

export const getLogoChainByName = (chainName?: string) => {
  if (!chainName) return;
  return config.chains.filter((chain) => chain.id === chainName)[0]?.icon;
};

export const isEVMNetwork = (chainId?: string) => {
  if (!chainId) return false;
  return chainId !== CHAINS.SOLANA && chainId !== CHAINS.BITCOIN;
};