import { toastError, toastSuccess } from './utils-notify';
import moment from 'moment';
import { isValidChecksumAddress, toChecksumAddress } from 'ethereumjs-util';
import copy from 'copy-to-clipboard';
import { COMMON_ERROR_MESSAGE } from '../constants';
import BigNumber from 'bignumber.js';
import { isAddress, isHexString } from 'ethers/lib/utils';

export const copyToClipboard = (message: string) => {
  try {
    copy(message);
    toastSuccess({ message: 'Copied' });
  } catch (error) {
    toastError({ message: getErrorMessage(error) });
  }
};

export const formatTimestamp = (
  timestamp: number,
  format = 'DD/MM/YYYY HH:mm:ss',
): string => {
  if (!timestamp) {
    return 'TBA';
  }
  return moment(timestamp).utc().format(format);
};

export const formatLargeNumber = (number?: number) => {
  if (!number) return '--';
  if (number < 1e3) return number;
  if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + 'K';
  if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
  if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
  if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
};

export const formatShortText = (text: string, digits = 6): string => {
  if (!text) {
    return '--';
  }
  return `${text.substring(0, digits)}...${text.substring(
    text.length - 3,
    text.length,
  )}`;
};

export const isValidAddressEVM = (address: string) => {
  try {
    const addressChecksum = toChecksumAddress(address);
    return isValidChecksumAddress(addressChecksum);
  } catch (e) {
    return false;
  }
};

export const isValidAddressSUIAndAptos = (address: string) => {
  const addressPattern = /^0x[0-9a-fA-F]{62}$|^0x[0-9a-fA-F]{64}$/;
  return addressPattern.test(address);
};

export const filterParams = (params: any) => {
  return Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
};

export const convertCurrencyToNumber = (value: string) => {
  return Number(value.replace(/[^0-9.-]+/g, ''));
};

export const isString = (value: unknown) => {
  return typeof value === 'string';
};

export const isNumber = (value: any) => {
  return (
    !isAddress(value) && !isHexString(value) && !new BigNumber(value).isNaN()
  );
};

export const getErrorMessage = (err: any) => {
  const REGEX_GET_MESSAGE = /execution reverted:([^"]*)/gm;
  if (err.message?.includes('execution reverted:')) {
    const match = REGEX_GET_MESSAGE.exec(err.message);
    return match ? match[1] : COMMON_ERROR_MESSAGE;
  }
  if (isString(err)) {
    return err;
  }
  if (err.message && isString(err.message)) {
    return err.message;
  }
  return COMMON_ERROR_MESSAGE;
};

export const areYAxisesSameType = (data: any[], yAxis: string[]) => {
  if (!data.length) {
    return false;
  }
  const [firstItem] = data;
  const filteredYAxis = yAxis.filter((axis) => !!axis);
  const areYAxisesAllNumber = filteredYAxis.every((item: string) =>
    isNumber(firstItem[item]),
  );
  const areYAxisesAllString = filteredYAxis.every(
    (item: string) => !isNumber(firstItem[item]),
  );
  return areYAxisesAllNumber || areYAxisesAllString;
};

export const shortAddressType = (address: string, separator = ':') => {
  const pos = address.indexOf(separator);
  return formatShortText(address.slice(0, pos)).concat(address.slice(pos));
};

export const generatePositiveRandomNumber = (maxValue: number) =>
  Math.floor(Math.random() * maxValue) + 1;
