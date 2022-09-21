import { toastError, toastSuccess, toastWarning } from './utils-notify';

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
