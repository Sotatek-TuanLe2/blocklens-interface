import { toastError, toastSuccess } from './utils-notify';
import moment from 'moment';
import { isValidChecksumAddress, toChecksumAddress } from 'ethereumjs-util';
import copy from 'copy-to-clipboard';

export const copyToClipboard = (message: string) => {
  try {
    copy(message);
    toastSuccess({ message: 'Copied' });
  } catch (error: any) {
    toastError({ message: 'Oops. Something went wrong' });
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

export const filterParams = (params: any) => {
  return Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
};

export const convertCurrencyToNumber = (value: string) => {
  return Number(value.replace(/[^0-9.-]+/g, ''));
};
