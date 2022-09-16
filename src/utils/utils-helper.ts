import { toastError, toastSuccess, toastWarning } from './utils-notify';

export const copyToClipboard = (message: string) => {
  if (!navigator.clipboard) {
    return;
    // return toastWarning({ message: "Your browser doesn't support copy" });
  }
  try {
    navigator.clipboard.writeText(message);
    // toastSuccess({ message: 'Copied' });
  } catch (error: any) {
    return;
    // toastError({ message: 'Oops. Something went wrong' });
  }
};
