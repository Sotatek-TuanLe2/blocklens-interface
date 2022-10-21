import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import { IAppInfo } from '../index';
import { getLogoChainByName } from 'src/utils/utils-network';
import { useHistory } from 'react-router';

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
  const history = useHistory();
  const [params, setParams] = useState<IParams>({});
  const [totalWebhook, setTotalWebhook] = useState<any>();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getContractActivity(params);
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

  const _renderNoData = () => {
    return (
      <Flex alignItems={'center'} my={10} flexDirection={'column'}>
        Set up your first contract activity webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          onClick={() => history.push(`/create-webhook-contract/${appInfo.appId}`)}
        >
          + Create webhook
        </Box>
      </Flex>
    );
  };

  const _renderBody = (data?: IContractResponse[]) => {
    return (
      <Tbody>
        {data?.map((contract: IContractResponse, index: number) => {
          return (
            <Tr key={index}>
              <Td>{contract.registrationId}</Td>
              <Td>{_renderStatus(contract)}</Td>
              <Td>{contract.webhook}</Td>
              <Td>N/A</Td>
              <Td>
                <AppLink to={`/webhooks/contract-activity/${contract.registrationId}`}>
                  View
                </AppLink>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <>
      <AppCard mt={10} className="list-nft" p={0}>
        <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
          <Flex alignItems="center">
            <Box className="icon-app-nft" mr={4} />
            <Box className="name">
              Contract Notifications
              <Box
                className="description"
              >
                Get notified when YOUR Contract occurs activities
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            fontWeight={'400'}
            size={'md'}
            onClick={() => history.push(`/create-webhook-contract/${appInfo.appId}`)}
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
    </>
  );
};

export default PartContractWebhooks;
