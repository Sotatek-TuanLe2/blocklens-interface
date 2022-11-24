import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { AppButton } from 'src/components';
import ModalCreateWebhookAddress from 'src/modals/ModalCreateWebhookAddress';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import {
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import ListWebhook from './ListWebhook';

interface IListAddress {
  appInfo: IAppResponse;
}

interface IParams {
  appId?: string;
  type?: string;
}

const PartAddressWebhooks: FC<IListAddress> = ({ appInfo }) => {
  const [isOpenCreateAddressModal, setIsOpenCreateAddressModal] =
    useState<boolean>(false);
  const [params, setParams] = useState<IParams>({});
  const [totalWebhook, setTotalWebhook] = useState<any>();
  const isDisabledApp = appInfo.status === APP_STATUS.DISABLED;

  const _renderNoData = () => {
    return (
      <Flex className="box-create">
        Set up your first address webhook!
        <AppButton
          isDisabled={isDisabledApp}
          size={'md'}
          onClick={() => {
            if (isDisabledApp) return;
            setIsOpenCreateAddressModal(true);
          }}
        >
          Create Webhook
        </AppButton>
      </Flex>
    );
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mx={10}>
        <Box className="description">
          Get notified whenever an address sends/receives any Token
        </Box>
        {totalWebhook > 0 && (
          <AppButton
            size={'sm'}
            px={4}
            py={1}
            className={'btn-create'}
            onClick={() => setIsOpenCreateAddressModal(true)}
          >
            <Box className="icon-plus-circle" mr={2} /> Create
          </AppButton>
        )}
      </Flex>

      <Box mt={3} className="list-table-wrap">
        <ListWebhook
          setTotalWebhook={setTotalWebhook}
          totalWebhook={totalWebhook}
          params={params}
          appInfo={appInfo}
          setParams={setParams}
          type={WEBHOOK_TYPES.ADDRESS_ACTIVITY}
        />
        {totalWebhook === 0 && _renderNoData()}
      </Box>

      <ModalCreateWebhookAddress
        open={isOpenCreateAddressModal}
        onClose={() => setIsOpenCreateAddressModal(false)}
        appInfo={appInfo}
        onReloadData={() =>
          setParams((pre: any) => {
            return { ...pre };
          })
        }
      />
    </>
  );
};

export default PartAddressWebhooks;
