import config from 'src/config';

export const getLogoChainByName = (chainName?: string) => {
  if (!chainName) return;
  return config.chains.filter((chain) => chain.id === chainName)[0]?.icon;
};
