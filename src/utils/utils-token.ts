import { isAddress } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';
import { erc20Contract } from './utils-contract';
import { getNetworkProvider } from './utils-network';

export const getAllowance = async (
  network: string,
  contractAddress: string,
  userAddress: string,
  spenderAddress: string,
) => {
  if (
    !isAddress(contractAddress) ||
    !isAddress(userAddress) ||
    !isAddress(spenderAddress)
  ) {
    return null;
  }
  const provider = getNetworkProvider(network);
  const contract = erc20Contract(contractAddress, provider);
  const allowance = await contract.allowance(userAddress, spenderAddress);
  return allowance.toString();
};

export const isTokenApproved = async (
  network: string,
  currencyAddress: string,
  walletAddress: string,
  contractAddress: string,
) => {
  const allowance = await getAllowance(
    network,
    currencyAddress,
    walletAddress,
    contractAddress,
  );
  return new BigNumber(allowance).gt(0);
};
