import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import 'src/styles/pages/AppDetail.scss';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppUploadABI,
  TYPE_ABI,
} from 'src/components';
import {
  IWebhook,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
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

  const _renderDetailAddressWebhook = () => {
    return (
      <AppField label={'Addresses'} customWidth={'100%'}>
        <Box className="field-disabled">
          {webhook.metadata.addresses.map((item: string, index: number) => {
            return <Box key={index}>{item}</Box>;
          })}
        </Box>
      </AppField>
    );
  };

  const _renderDetailNFTWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'NFT Address'} customWidth={'49%'}>
          <AppInput value={webhook.metadata.address} isDisabled />
        </AppField>
        <AppField label={'Token ID'} customWidth={'49%'}>
          <AppInput value={webhook.metadata.tokenIds.join(', ')} isDisabled />
        </AppField>

        <AppUploadABI
          viewOnly
          type={TYPE_ABI.NFT}
          abi={webhook.metadata.abi}
          abiFilter={webhook.metadata.abiFilter}
        />
      </Flex>
    );
  };

  const _renderDetailContractWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Contract address'} customWidth={'100%'}>
          <AppInput value={webhook.metadata.address} isDisabled />
        </AppField>
        <AppUploadABI
          viewOnly
          abi={webhook.metadata.abi}
          abiFilter={webhook.metadata.abiFilter}
        />
      </Flex>
    );
  };

  const _renderDetailWebhook = () => {
    switch (webhook.type) {
      case WEBHOOK_TYPES.NFT_ACTIVITY:
        return _renderDetailNFTWebhook();
      case WEBHOOK_TYPES.ADDRESS_ACTIVITY:
        return _renderDetailAddressWebhook();
      case WEBHOOK_TYPES.CONTRACT_ACTIVITY:
        return _renderDetailContractWebhook();
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

      <AppCard mt={7}>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Network'} customWidth={'49%'}>
            <AppInput value={webhook.network} isDisabled />
          </AppField>
          <AppField label={'Webhook URL'} customWidth={'49%'}>
            <AppInput value={webhook.webhook} isDisabled />
          </AppField>
        </Flex>
        {_renderDetailWebhook()}
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
