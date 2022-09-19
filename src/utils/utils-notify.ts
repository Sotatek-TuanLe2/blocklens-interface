import { createStandaloneToast } from '@chakra-ui/toast';

type ToastContentType = {
  title?: string;
  message: string;
};

type NOTIFY_TYPE = 'success' | 'error' | 'warning' | 'info';

const toast = createStandaloneToast();

const addToast = (type: NOTIFY_TYPE, content: ToastContentType) => {
  toast({
    title: content.title,
    description: content.message,
    status: type,
    duration: 9000,
    isClosable: true,
    position: 'top-right',
  });
};

export const toastError = (content: ToastContentType): void => {
  return addToast('error', content);
};

export const toastSuccess = (content: ToastContentType): void => {
  return addToast('success', content);
};

export const toastInfo = (content: ToastContentType): void => {
  return addToast('info', content);
};

export const toastWarning = (content: ToastContentType): void => {
  return addToast('warning', content);
};
