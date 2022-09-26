import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import { IAppInfo } from '../index';
import { getLogoChainByName } from 'src/utils/utils-network';
import ModalCreateWebhookContract from 'src/modals/ModalCreateWebhookContract';

interface IListContract {
  appInfo: IAppInfo;
}

interface IParams {
  appId?: number;
}

interface IContractResponse {
  userId: number;
  registrationId: number;
  network: string;
  type: string;
  webhook: string;
  status?: string;
  contractAddress: string;
  abi: string[];
}

const PartContractWebhooks: FC<IListContract> = ({ appInfo }) => {
  const [isOpenCreateContractModal, setIsOpenCreateContractModal] =
    useState<boolean>(false);
  const [params, setParams] = useState<IParams>({});

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getContractActivity(params);
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
          <Th>Address</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderStatus = (contract: IContractResponse) => {
    if (!contract.status) return 'N/A';
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme="green"
        px={5}
      >
        {contract.status}
      </Tag>
    );
  };

  const _renderNetwork = (contract: IContractResponse) => {
    return (
      <Flex alignItems={'center'}>
        <Box mr={2} className={getLogoChainByName(appInfo.chain)}></Box>
        {contract.network}
      </Flex>
    );
  };

  const _renderBody = (data?: IContractResponse[]) => {
    return (
      <Tbody>
        {data?.map((contract: IContractResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td>N/A</Td>
              <Td>{_renderNetwork(contract)}</Td>
              <Td>{_renderStatus(contract)}</Td>
              <Td>{contract.webhook}</Td>
              <Td>N/A</Td>
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
            <Box className="icon-app-nft" mr={4} />
            <Box className="name">
              Contract Activity
              <Box
                className="description"
                textTransform="uppercase"
                fontSize={'13px'}
              >
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            size={'md'}
            onClick={() => setIsOpenCreateContractModal(true)}
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

      <ModalCreateWebhookContract
        open={isOpenCreateContractModal}
        onClose={() => setIsOpenCreateContractModal(false)}
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

export default PartContractWebhooks;
