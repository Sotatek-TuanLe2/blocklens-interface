import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import 'src/styles/pages/AppDetail.scss';
import { AppButton, AppCard } from 'src/components';
import { IWebhook, WEBHOOK_STATUS } from 'src/utils/utils-webhook';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import ModalDeleteWebhook from 'src/modals/ModalDeleteWebhook';

interface IAppSettings {
  onBack: () => void;
  reloadData: () => void;
  webhook: IWebhook;
}

const WebhookSettings: FC<IAppSettings> = ({ onBack, webhook, reloadData }) => {
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const isActive = useMemo(
    () => webhook.status === WEBHOOK_STATUS.ENABLE,
    [webhook],
  );

  const onUpdateStatus = async () => {
    try {
      await rf
        .getRequest('RegistrationRequest')
        .updateStatus(webhook.appId, webhook.registrationId, {
          status:
            webhook.status === WEBHOOK_STATUS.ENABLE
              ? WEBHOOK_STATUS.DISABLED
              : WEBHOOK_STATUS.ENABLE,
        });
      toastSuccess({ message: 'Update Successfully!' });
      reloadData();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  return (
    <>
      <Flex className="app-info">
        <Flex className="name">
          <Box
            className="icon-arrow-left"
            mr={6}
            onClick={onBack}
            cursor="pointer"
          />
          <Box>Setting</Box>
        </Flex>

        <Flex>
          <AppButton
            size={'md'}
            variant="cancel"
            mr={5}
            onClick={() => setIsOpenModalDelete(true)}
          >
            <Box className="icon-trash" />
          </AppButton>
        </Flex>
      </Flex>

      <AppCard className="app-status">
        <Flex justifyContent={'space-between'}>
          <Flex alignItems="center">
            <Box className="title-status">Webhook Status</Box>
            <Box
              className={isActive ? 'icon-active' : 'icon-inactive'}
              mr={2}
            />
            <Box>{isActive ? 'Active' : 'Inactive'}</Box>
          </Flex>

          <AppButton onClick={onUpdateStatus}>
            {isActive ? 'Deactivate' : 'Activate'}
          </AppButton>
        </Flex>
      </AppCard>

      {isOpenModalDelete && (
        <ModalDeleteWebhook
          webhook={webhook}
          onClose={() => setIsOpenModalDelete(false)}
          open={isOpenModalDelete}
        />
      )}
    </>
  );
};

export default WebhookSettings;
