import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import ModalCreateWebhookAddress from 'src/modals/ModalCreateWebhookAddress';
import { IAppInfo } from '../index';
import { getLogoChainByName } from 'src/utils/utils-network';

interface IListAddress {
  appInfo: IAppInfo;
}

interface IParams {
  appId?: number;
}

interface IAddressResponse {
  userId: number;
  registrationId: number;
  network: string;
  type: string;
  webhook: string;
  status?: string;
  addresses: string[];
}

const PartAddressWebhooks: FC<IListAddress> = ({ appInfo }) => {
  const [isOpenCreateAddressModal, setIsOpenCreateAddressModal] =
    useState<boolean>(false);
  const [params, setParams] = useState<IParams>({});

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getAddressActivity(params);
      return res;
    } catch (error) {
      return error;
    }
  }, []);

  useEffect(() => {
    setParams({
      ...params,
      appId: appInfo.appId,
    });
  }, [appInfo]);

  const _renderHeader = () => {
    return (
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>App/Network</Th>
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>{appInfo.chain} Address</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderStatus = (address: IAddressResponse) => {
    if (!address.status) return 'N/A';
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme="green"
        px={5}
      >
        {address.status}
      </Tag>
    );
  };

  const _renderNetwork = (address: IAddressResponse) => {
    return (
      <Flex alignItems={'center'}>
        <Box mr={2} className={getLogoChainByName(appInfo.chain)}></Box>
        {address.network}
      </Flex>
    );
  };

  const _renderBody = (data?: IAddressResponse[]) => {
    return (
      <Tbody>
        {data?.map((address: IAddressResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td><AppLink to={`/logs/${address.registrationId}`}>{address.registrationId}</AppLink></Td>
              <Td>{_renderNetwork(address)}</Td>
              <Td>{_renderStatus(address)}</Td>
              <Td>{address.webhook}</Td>
              <Td>{address.addresses.length} {address.addresses.length > 1 ? 'Addresses' : 'Address'}</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <>
      <AppCard mt={10} className="list-nft" p={0} pb={5}>
        <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
          <Flex alignItems="center">
            <Box className="icon-app-address" mr={4} />
            <Box className="name">
              Address Activity
              <Box
                className="description"
                textTransform="uppercase"
                fontSize={'13px'}
              >
                Get notified whenever an address sends/receives ETH or any Token
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            size={'md'}
            onClick={() => setIsOpenCreateAddressModal(true)}
          >
            <SmallAddIcon mr={1} /> Create webhook
          </AppButton>
        </Flex>
        <AppDataTable
          requestParams={params}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
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
