import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, FC } from 'react';
import {
  AppButton,
  AppCard,
  AppDataTable,
  AppLoadingTable,
} from 'src/components';
import { IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import useUser from 'src/hooks/useUser';
import { _renderChainApp, _renderStatus } from './ListApps';

interface IWebhookMobile {
  webhook: IAppResponse;
}

const WebhookMobile: FC<IWebhookMobile> = ({ webhook }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Box
        className={`${isOpen ? 'open' : ''} card-mobile`}
        onClick={() => history.push(`/app/${webhook.appId}`)}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">{webhook.name}</Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Status</Box>
          <Box>{_renderStatus(webhook.status)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Network</Box>
              <Box className="value">
                {_renderChainApp(webhook.chain, webhook.network.toLowerCase())}
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Type</Box>
              <Box className="value">--</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Message today</Box>
              <Box className="value">{webhook.messageToday}</Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const ListWebhooks: React.FC = () => {
  const history = useHistory();
  const { user } = useUser();
  const userStats = user?.getStats();

  const fetchDataTable: any = async () => {
    try {
      return [];
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w="25%">NAME</Th>
          <Th w="20%">TYPE</Th>
          <Th w="20%">Network</Th>
          <Th w="20%" textAlign={'center'}>
            Messages today
          </Th>
          <Th w="15%" textAlign={'right'}>
            Status
          </Th>
        </Tr>
      </Thead>
    );
  };

  const _renderLoading = () => {
    const widthColumns = [25, 20, 20, 20, 15];
    return <AppLoadingTable widthColumns={widthColumns} />;
  };

  const _renderListWebhookMobile = (data?: IAppResponse[]) => {
    return (
      <Box className="list-card-mobile">
        {data?.map((webhook: IAppResponse, index: number) => {
          return <WebhookMobile webhook={webhook} key={index} />;
        })}
      </Box>
    );
  };

  const _renderBody = (data?: IAppResponse[]) => {
    if (isMobile) return _renderListWebhookMobile(data);
    return (
      <Tbody>
        {data?.map((webhook: IAppResponse, index: number) => {
          return (
            <Tr
              key={index}
              className="tr-list"
              onClick={() => history.push(`/`)}
            >
              <Td w="25%">{webhook.name}</Td>
              <Td w="20%">--</Td>
              <Td w="20%">
                {_renderChainApp(webhook.chain, webhook.network.toLowerCase())}
              </Td>
              <Td w="20%" textAlign={'center'}>
                {webhook?.messageToday}
              </Td>
              <Td w="15%" textAlign={'right'}>
                {_renderStatus(webhook.status)}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderTotalWebhook = () => {
    return (
      <Box className="number-app">
        {userStats?.totalRegistrationActive}/{userStats?.totalRegistration}
        <span> </span>active
      </Box>
    );
  };

  return (
    <Box className="list-app-hp">
      <AppCard className="list-table-wrap">
        <Flex className="title-list-app">
          <Text className="text-title">Webhooks</Text>
          <Flex alignItems={'center'}>
            {!isMobile && _renderTotalWebhook()}

            <AppButton size={'sm'} onClick={() => history.push('/')}>
              <Box className="icon-plus-circle" mr={2} /> Create
            </AppButton>
          </Flex>
        </Flex>

        {isMobile && (
          <Box px={5} mb={3}>
            {_renderTotalWebhook()}
          </Box>
        )}

        <AppDataTable
          renderLoading={_renderLoading}
          fetchData={fetchDataTable}
          renderBody={_renderBody}
          renderHeader={_renderHeader}
          limit={10}
        />
      </AppCard>
    </Box>
  );
};

export default ListWebhooks;
