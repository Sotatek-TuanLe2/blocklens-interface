import { toastError, toastSuccess, toastWarning } from './utils-notify';
import moment from 'moment';

export const copyToClipboard = (message: string) => {
  if (!navigator.clipboard) {
    return toastWarning({ message: "Your browser doesn't support copy" });
  }
  try {
    navigator.clipboard.writeText(message);
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
  return moment(timestamp).format(format);
};
