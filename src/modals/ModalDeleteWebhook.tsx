import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import {
  INFTWebhook,
  IAddressWebhook,
  IContractWebhook,
} from 'src/utils/utils-webhook';

interface IModalEditApp {
  open: boolean;
  onClose: () => void;
  reloadData: () => void;
  webhook: INFTWebhook | IContractWebhook | IAddressWebhook;
}

const ModalDeleteWebhook: FC<IModalEditApp> = ({
  open,
  reloadData,
  onClose,
  webhook,
}) => {
  const onDelete = async () => {
    try {
      await rf
        .getRequest('RegistrationRequest')
        .deleteRegistration(webhook.appId, webhook.registrationId);
      toastSuccess({ message: 'Delete Successfully!' });
      onClose();
      reloadData();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="xl"
      title="Delete this webhook?"
      isOpen={open}
      isHideCloseIcon
      onClose={onClose}
      onActionRight={onDelete}
      onActionLeft={onClose}
      textActionRight="Confirm"
      textActionLeft="Cancel"
    >
      <Box color={'gray.600'}>
        <Box textAlign="center" mb={3}>
          Webhook Id: {webhook.registrationId}
        </Box>
        <Box textAlign="center">URL: {webhook.webhook}</Box>
      </Box>
    </BaseModal>
  );
};

export default ModalDeleteWebhook;
