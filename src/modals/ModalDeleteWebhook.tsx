import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import BaseModal from './BaseModal';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { IWebhook } from 'src/utils/utils-webhook';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';

interface IModalDeleteWebhook {
  open: boolean;
  onClose: () => void;
  webhook: IWebhook;
}

const ModalDeleteWebhook: FC<IModalDeleteWebhook> = ({
  open,
  onClose,
  webhook,
}) => {
  const history = useHistory();

  const onDelete = async () => {
    try {
      await rf
        .getRequest('RegistrationRequest')
        .deleteRegistration(webhook.appId, webhook.registrationId);
      toastSuccess({ message: 'Delete Successfully!' });
      history.push(`/app-detail/${webhook.appId}`);
      onClose();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <BaseModal
      size="xl"
      title="Delete This Webhook?"
      icon="icon-delete"
      isOpen={open}
      onClose={onClose}
    >
      <Box className={'infos'}>
        <Flex justifyContent={'space-between'} className="info">
          <Box>Webhook ID</Box>
          <Box>{webhook.registrationId}</Box>
        </Flex>
        <Flex justifyContent={'space-between'}  className="info">
          <Box>URL</Box>
          <Box>{webhook.webhook}</Box>
        </Flex>
      </Box>

      <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
        <AppButton
          width={'49%'}
          size={'lg'}
          variant={'cancel'}
          onClick={onClose}
        >
          Cancel
        </AppButton>
        <AppButton width={'49%'} size={'lg'} onClick={onDelete}>
          Delete
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalDeleteWebhook;
