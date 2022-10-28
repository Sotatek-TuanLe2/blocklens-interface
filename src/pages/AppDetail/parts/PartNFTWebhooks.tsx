import { Flex, Tbody, Th, Thead, Tr, Td, Box, Tag } from '@chakra-ui/react';
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
  INFTWebhook,
} from 'src/utils/utils-webhook';

interface IListNTF {
  appInfo: IAppResponse;
}

interface IParams {
  appId?: number;
}

const PartNFTWebhooks: FC<IListNTF> = ({ appInfo }) => {
  const [params, setParams] = useState<IParams>({});
  const history = useHistory();
  const [totalWebhook, setTotalWebhook] = useState<any>();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      const res: IListAppResponse = await rf
        .getRequest('RegistrationRequest')
        .getNFTActivity(params);
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

  const _renderStatus = (nft: INFTWebhook) => {
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme={nft.status === WEBHOOK_STATUS.ENABLE ? 'green' : 'red'}
        px={5}
      >
        {getStatusWebhook(nft.status)}
      </Tag>
    );
  };

  const _renderBody = (data?: INFTWebhook[]) => {
    return (
      <Tbody>
        {data?.map((nft: INFTWebhook, index: number) => {
          return (
            <Tr key={index}>
              <Td>{nft.registrationId}</Td>
              <Td>{_renderStatus(nft)}</Td>
              <Td>{nft.webhook}</Td>
              <Td>1 Address</Td>
              <Td>
                <AppLink to={`/webhooks/nft-activity/${nft.registrationId}`}>
                  View details
                </AppLink>

                <ListActionWebhook
                  webhook={nft}
                  type="nft-activity"
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
        Set up your first NFT activity webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          onClick={() => history.push(`/create-webhook-nft/${appInfo.appId}`)}
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
            <Box className="icon-app-nft" mr={4} />
            <Box className="name">
              NFT Activity
              <Box className="description">
                Get notified when an NFT is transferred
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            size={'md'}
            onClick={() => history.push(`/create-webhook-nft/${appInfo.appId}`)}
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

export default PartNFTWebhooks;
