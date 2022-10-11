import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import ModalCreateWebhookAddress from 'src/modals/ModalCreateWebhookAddress';
import { IAppInfo } from '../index';

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
  const [totalWebhook, setTotalWebhook] = useState<any>();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getAddressActivity(params);
      setTotalWebhook(res.totalDocs);
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
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>Address</Th>
          <Th>Activities</Th>
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

  const _renderBody = (data?: IAddressResponse[]) => {
    return (
      <Tbody>
        {data?.map((address: IAddressResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td>{address.registrationId}</Td>
              <Td>{_renderStatus(address)}</Td>
              <Td>{address.webhook}</Td>
              <Td>
                {address.addresses.length}{' '}
                {address.addresses.length > 1 ? 'Addresses' : 'Address'}
              </Td>
              <Td>
                <AppLink to={`/notifications/${address.registrationId}`}>
                  View
                </AppLink>
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

        <Box bgColor={'#FAFAFA'} pb={8}>
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
