import { Box, Flex, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useState } from 'react';
import { AppButton, AppCard } from 'src/components';
import ModalCreateWebhookAddress from 'src/modals/ModalCreateWebhookAddress';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import {
  getStatusWebhook,
  WEBHOOK_STATUS,
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

export const StatusWebhook = ({ status }: any) => {
  return (
    <Tag
      size={'sm'}
      borderRadius="full"
      variant="solid"
      colorScheme={status === WEBHOOK_STATUS.ENABLE ? 'green' : 'red'}
      px={5}
    >
      {getStatusWebhook(status)}
    </Tag>
  );
};

const PartAddressWebhooks: FC<IListAddress> = ({ appInfo }) => {
  const [isOpenCreateAddressModal, setIsOpenCreateAddressModal] =
    useState<boolean>(false);
  const [params, setParams] = useState<IParams>({});
  const [totalWebhook, setTotalWebhook] = useState<any>();
  const isDisabledApp = appInfo.status === APP_STATUS.DISABLED;

  const _renderNoData = () => {
    return (
      <Flex alignItems={'center'} my={10} flexDirection={'column'}>
        Set up your first address webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          cursor={isDisabledApp ? 'not-allowed' : 'pointer'}
          onClick={() => {
            if (isDisabledApp) return;
            setIsOpenCreateAddressModal(true);
          }}
        >
          + Create webhook
        </Box>
      </Flex>
    );
  };

  return (
    <>
      <AppCard mt={10} className="list-nft" p={0}>
        <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
          <Flex alignItems="center">
            <Box className="icon-app-address" mr={4} />
            <Box className="name">
              Address Activity
              <Box className="description">
                Get notified whenever an address sends/receives ETH or any Token
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            size={'md'}
            fontWeight={'400'}
            isDisabled={isDisabledApp}
            onClick={() => setIsOpenCreateAddressModal(true)}
          >
            <SmallAddIcon mr={1} /> Create webhook
          </AppButton>
        </Flex>

        <Box bgColor={'#FAFAFA'} borderBottomRadius={'10px'} pb={8}>
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
      </AppCard>

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
