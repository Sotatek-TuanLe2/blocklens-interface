import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import {
  AppButton,
  AppButtonLarge,
  AppCard,
  AppField,
  AppHeading,
  AppInput,
  AppReadABI,
  AppUploadABI,
  TYPE_ABI,
} from 'src/components';
import useAppDetails from 'src/hooks/useAppDetails';
import useWebhookDetails from 'src/hooks/useWebhook';
import { BasePage } from 'src/layouts';
import ModalDeleteWebhook from 'src/modals/ModalDeleteWebhook';
import rf from 'src/requests/RequestFactory';
import { getUserStats } from 'src/store/user';
import 'src/styles/pages/AppDetail.scss';
import { APP_STATUS } from 'src/utils/utils-app';
import { getErrorMessage } from 'src/utils/utils-helper';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import {
  IWebhook,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { COIN_EVENTS } from './CreateWebhookPage/parts/PartFormCoinActivityAptos';
import { getDataAddress } from './CreateWebhookPage/parts/PartFormModuleActivityAptos';
import {
  ListSelectEvent,
  TOKEN_EVENTS,
} from './CreateWebhookPage/parts/PartFormTokenActivityAptos';

interface IModuleAptosDetail {
  address: string;
  data: IWebhook;
}

const ModuleAptosDetail: FC<IModuleAptosDetail> = ({ address, data }) => {
  const [dataAddress, setDataAddress] = useState<any>(null);
  const [_isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (address) {
      getDataAddress(address, setDataAddress, setIsLoading).then();
    }
  }, [address]);

  if (!dataAddress && !_isLoading) return <></>;

  if (_isLoading) return <Box>Loading...</Box>;

  return (
    <Box w={'full'}>
      <AppReadABI
        isViewOnly
        address={address || ''}
        dataWebhook={{
          functions: data.metadata.functions,
          events: data.metadata.events,
        }}
        dataAddress={dataAddress}
      />
    </Box>
  );
};

const WebhookSettingsPage = () => {
  const { id: webhookId } = useParams<{ appId: string; id: string }>();
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { webhook, getWebhookInfo } = useWebhookDetails(webhookId);
  const history = useHistory();

  const isActive = useMemo(
    () => webhook?.status === WEBHOOK_STATUS.ENABLE,
    [webhook],
  );

  const onUpdateStatus = async () => {
    try {
      await rf
        .getRequest('RegistrationRequest')
        .updateStatus(webhook.registrationId, {
          status:
            webhook.status === WEBHOOK_STATUS.ENABLE
              ? WEBHOOK_STATUS.DISABLED
              : WEBHOOK_STATUS.ENABLE,
        });
      dispatch(getUserStats());
      toastSuccess({ message: 'Update Successfully!' });
      await getWebhookInfo();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
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
          <AppInput
            value={webhook?.metadata?.tokenIds.join(', ') || '*'}
            isDisabled
          />
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

  const _renderDetailTokenWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Token Address'} customWidth={'100%'}>
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

  const _renderDetailCoinActivityAptosWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Coin Type'} customWidth={'100%'}>
          <AppInput value={webhook?.metadata?.coinType} isDisabled />
        </AppField>
        <Box w={'full'}>
          <Box mb={1}>Events</Box>
          <ListSelectEvent
            viewOnly
            eventsSelected={webhook?.metadata?.events}
            dataEvent={COIN_EVENTS}
          />
        </Box>
      </Flex>
    );
  };

  const _renderDetailTokenActivityAptosWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Collection Name'} customWidth={'49%'}>
          <AppInput value={webhook?.metadata?.collectionName} isDisabled />
        </AppField>
        <AppField label={'Creator Address'} customWidth={'49%'}>
          <AppInput value={webhook?.metadata?.creatorAddress} isDisabled />
        </AppField>
        <AppField label={'Name'} customWidth={'100%'}>
          <AppInput value={webhook?.metadata?.name} isDisabled />
        </AppField>

        <Box w={'full'}>
          <Box mb={1}>Events</Box>
          <ListSelectEvent
            viewOnly
            eventsSelected={webhook?.metadata?.events}
            dataEvent={TOKEN_EVENTS}
          />
        </Box>
      </Flex>
    );
  };

  const _renderDetailModuleActivityAptosWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Address'} customWidth={'100%'}>
          <AppInput value={webhook?.metadata?.address} isDisabled />
        </AppField>

        <ModuleAptosDetail
          address={webhook?.metadata?.address}
          data={webhook}
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
      case WEBHOOK_TYPES.TOKEN_ACTIVITY:
        return _renderDetailTokenWebhook();
      case WEBHOOK_TYPES.APTOS_COIN_ACTIVITY:
        return _renderDetailCoinActivityAptosWebhook();
      case WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY:
        return _renderDetailTokenActivityAptosWebhook();
      case WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY:
        return _renderDetailModuleActivityAptosWebhook();
    }
  };

  return (
    <BasePage className="app-detail">
      <>
        <Flex className="app-info">
          <AppHeading
            isCenter
            title="Settings"
            linkBack={`/webhooks/${webhookId}`}
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
                <Box>{isActive ? 'ACTIVE' : 'INACTIVE'}</Box>
              </Flex>
            </Flex>

            <AppButtonLarge
              onClick={onUpdateStatus}
              //   isDisabled={appInfo.status === APP_STATUS.DISABLED}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </AppButtonLarge>
          </Flex>
        </AppCard>

        <AppCard className="basic-setting">
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField label={'Network'} customWidth={'49%'}>
              <Flex className="chain-app">
                <Box className={getLogoChainByChainId(webhook?.chain)} mr={3} />
                <Box>{getNameChainByChainId(webhook?.chain)}</Box>
                <Box textTransform="capitalize" ml={2}>
                  {webhook?.network?.toLowerCase()}
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
    </BasePage>
  );
};

export default WebhookSettingsPage;
