import { Box, Flex, Tag, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { IListAppResponse } from 'src/utils/common';
import { useHistory } from 'react-router';
import { IAppResponse } from 'src/utils/utils-app';
import ListActionWebhook from './ListActionWebhook';
import {
  getStatusWebhook,
  WEBHOOK_STATUS,
  IContractWebhook,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { formatShortText } from 'src/utils/utils-helper';

interface IListContract {
  appInfo: IAppResponse;
}

interface IParams {
  appId?: string;
  type?: string;
}

const PartContractWebhooks: FC<IListContract> = ({ appInfo }) => {
  const history = useHistory();
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
      type: WEBHOOK_TYPES.CONTRACT_ACTIVITY,
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

  const _renderStatus = (contract: IContractWebhook) => {
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme={
          contract.status === WEBHOOK_STATUS.ENABLE ? 'green' : 'red'
        }
        px={5}
      >
        {getStatusWebhook(contract.status)}
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
          onClick={() =>
            history.push(`/create-webhook-contract/${appInfo.appId}`)
          }
        >
          + Create webhook
        </Box>
      </Flex>
    );
  };

  const _renderBody = (data?: IContractWebhook[]) => {
    return (
      <Tbody>
        {data?.map((contract: IContractWebhook, index: number) => {
          return (
            <Tr key={index}>
              <Td>{formatShortText(contract.registrationId)}</Td>
              <Td>{_renderStatus(contract)}</Td>
              <Td>
                <a
                  href={contract.webhook}
                  target="_blank"
                  className="short-text"
                >
                  {contract.webhook}
                </a>
              </Td>
              <Td>1 Address</Td>
              <Td>
                <AppLink
                  to={`/webhooks/contract-activity/${contract.registrationId}`}
                >
                  View details
                </AppLink>
                <ListActionWebhook
                  webhook={contract}
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

  return (
    <>
      <AppCard mt={10} className="list-nft" p={0}>
        <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
          <Flex alignItems="center">
            <Box className="icon-app-nft" mr={4} />
            <Box className="name">
              Contract Notifications
              <Box className="description">
                Get notified when YOUR Contract occurs activities
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            fontWeight={'400'}
            size={'md'}
            onClick={() =>
              history.push(`/create-webhook-contract/${appInfo.appId}`)
            }
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
