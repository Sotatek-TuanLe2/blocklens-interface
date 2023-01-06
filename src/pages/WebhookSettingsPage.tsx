import { Box, Flex } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import 'src/styles/pages/AppDetail.scss';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppUploadABI,
  AppButtonLarge,
  TYPE_ABI,
} from 'src/components';
import { WEBHOOK_STATUS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import ModalDeleteWebhook from 'src/modals/ModalDeleteWebhook';
import { APP_STATUS } from 'src/utils/utils-app';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import { useDispatch } from 'react-redux';
import { getUserStats } from 'src/store/user';
import { useParams } from 'react-router';
import { AppHeading } from 'src/components';
import { BasePageContainer } from 'src/layouts';
import useAppDetails from 'src/hooks/useAppDetails';
import useWebhookDetails from 'src/hooks/useWebhook';

const WebhookSettingsPage = () => {
  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { appInfo } = useAppDetails(appId);
  const { webhook, getWebhookInfo } = useWebhookDetails(appId, webhookId);

  const isActive = useMemo(
    () => webhook?.status === WEBHOOK_STATUS.ENABLE,
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
      dispatch(getUserStats());
      toastSuccess({ message: 'Update Successfully!' });
      await getWebhookInfo();
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
          <AppInput value={webhook?.metadata?.address} isDisabled />
        </AppField>
        <AppField label={'Token ID'} customWidth={'49%'}>
          <AppInput value={webhook?.metadata?.tokenIds.join(', ') || '*'} isDisabled />
        </AppField>

        <AppUploadABI
          viewOnly
          type={TYPE_ABI.NFT}
          abi={webhook?.metadata?.abi}
          abiFilter={webhook?.metadata?.abiFilter}
        />
      </Flex>
    );
  };

  const _renderDetailContractWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Contract address'} customWidth={'100%'}>
          <AppInput value={webhook?.metadata?.address} isDisabled />
        </AppField>
        <AppUploadABI
          viewOnly
          abi={webhook?.metadata?.abi}
          abiFilter={webhook?.metadata?.abiFilter}
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
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <AppHeading
            isCenter
            title="Settings"
            linkBack={`/app/${appId}/webhooks/${webhookId}`}
          />

          <Flex>
            <AppButton
              size={'md'}
              variant="cancel"
              onClick={() => setIsOpenModalDelete(true)}
            >
              <Box className="icon-trash" />
            </AppButton>
          </Flex>
        </Flex>

        <AppCard className="app-status">
          <Flex justifyContent={'space-between'}>
            <Flex className="box-status">
              <Box className="title-status">Webhook Status</Box>
              <Flex alignItems={'center'}>
                <Box
                  className={isActive ? 'icon-active' : 'icon-inactive'}
                  mr={2}
                />
                <Box>{isActive ? 'Active' : 'Inactive'}</Box>
              </Flex>
            </Flex>

            <AppButtonLarge
              onClick={onUpdateStatus}
              isDisabled={appInfo.status === APP_STATUS.DISABLED}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </AppButtonLarge>
          </Flex>
        </AppCard>

        <AppCard className="basic-setting">
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField label={'Network'} customWidth={'49%'}>
              <Flex className="chain-app">
                <Box className={getLogoChainByChainId(appInfo?.chain)} mr={3} />
                <Box>{getNameChainByChainId(appInfo?.chain)}</Box>
                <Box textTransform="capitalize" ml={2}>
                  {appInfo?.network?.toLowerCase()}
                </Box>
              </Flex>
            </AppField>
            <AppField label={'Webhook URL'} customWidth={'49%'}>
              <AppInput value={webhook?.webhook} isDisabled />
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
    </BasePageContainer>
  );
};

export default WebhookSettingsPage;
