import { Contract } from 'ethers';
import abi from 'src/abi';
import { Interface as AbiInterface } from '@ethersproject/abi';
import { BaseProvider } from '@ethersproject/providers';
import { isValidAddressEVM } from './utils-helper';

export function getContract(
  address: string,
  ABI: AbiInterface,
  provider: BaseProvider,
): Contract {
  if (!isValidAddressEVM(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, provider);
}

export const erc20Contract = (
  address: string,
  provider: BaseProvider,
): Contract => {
  return getContract(address, abi['erc20'], provider);
};

export const billingContract = (
  address: string,
  provider: BaseProvider,
): Contract => {
  return getContract(address, abi['billing'], provider);
};
