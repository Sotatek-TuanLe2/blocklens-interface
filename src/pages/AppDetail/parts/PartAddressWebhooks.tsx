import { Box, Flex, Tag, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import ModalCreateWebhookAddress from 'src/modals/ModalCreateWebhookAddress';
import { IAppResponse } from 'src/utils/utils-app';
import {
  getStatusWebhook,
  WEBHOOK_STATUS,
  IAddressWebhook,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import ListActionWebhook from './ListActionWebhook';
import { formatShortText } from 'src/utils/utils-helper';

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

  const fetchDataTable: any = useCallback(
    async (params: any) => {
      try {
        const res: IListAppResponse = await rf
          .getRequest('RegistrationRequest')
          .getRegistrations(appInfo.appId, params);
        setTotalWebhook(res.totalDocs);
        return res;
      } catch (error) {
        return error;
      }
    },
    [appInfo, params],
  );

  useEffect(() => {
    setParams({
      ...params,
      type: WEBHOOK_TYPES.ADDRESS_ACTIVITY,
      appId: appInfo.appId,
    });
  }, [appInfo]);

  const _renderHeader = () => {
    return (
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>Address</Th>
          <Th>Activities</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderStatus = (address: IAddressWebhook) => {
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme={address.status === WEBHOOK_STATUS.ENABLE ? 'green' : 'red'}
        px={5}
      >
        {getStatusWebhook(address.status)}
      </Tag>
    );
  };

  const _renderBody = (data?: IAddressWebhook[]) => {
    return (
      <Tbody>
        {data?.map((address: IAddressWebhook, index: number) => {
          return (
            <Tr key={index}>
              <Td>{formatShortText(address.registrationId)}</Td>
              <Td>{_renderStatus(address)}</Td>
              <Td>
                <a
                  href={address.webhook}
                  target="_blank"
                  className="short-text"
                >
                  {address.webhook}
                </a>
              </Td>
              <Td>
                {address.metadata.addresses.length}{' '}
                {address.metadata.addresses.length > 1
                  ? 'Addresses'
                  : 'Address'}
              </Td>
              <Td>
                <AppLink
                  to={`/webhooks/address-activity/${address.registrationId}`}
                >
                  View details
                </AppLink>

                <ListActionWebhook
                  webhook={address}
                  reloadData={() =>
                    setParams((pre: any) => {
                      return { ...pre };
                    })
                  }
                />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderNoData = () => {
    return (
      <Flex alignItems={'center'} my={10} flexDirection={'column'}>
        Set up your first address webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          onClick={() => setIsOpenCreateAddressModal(true)}
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
            onClick={() => setIsOpenCreateAddressModal(true)}
          >
            <SmallAddIcon mr={1} /> Create webhook
          </AppButton>
        </Flex>

        <Box bgColor={'#FAFAFA'} borderBottomRadius={'10px'} pb={8}>
          <AppDataTable
            requestParams={params}
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            isNotShowNoData
            renderHeader={totalWebhook > 0 ? _renderHeader : undefined}
            limit={10}
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
