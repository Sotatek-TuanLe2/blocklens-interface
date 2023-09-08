import { Box, Flex, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, FC } from 'react';
import {
  AppButton,
  AppCard,
  AppChainNetwork,
  AppDataTable,
  AppLoadingTable,
  AppStatus,
} from 'src/components';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import useUser from 'src/hooks/useUser';
import { ROUTES } from 'src/utils/common';
import rf from 'src/requests/RequestFactory';
import { getNameWebhook, IWebhook } from 'src/utils/utils-webhook';
import { IAppResponse } from '../../../utils/utils-app';
import { IWebhookStats } from 'src/pages/WebhookDetail/parts/PartWebhookStats';

interface IWebhookMobile {
  webhook: IWebhook;
}

const WebhookMobile: FC<IWebhookMobile> = ({ webhook }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Box
        className={`${isOpen ? 'open' : ''} card-mobile`}
        onClick={() => history.push(`/webhooks/${webhook.registrationId}`)}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">{webhook?.webhookName}</Box>
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
          <Box>
            <AppStatus status={webhook.status} />
          </Box>
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
                <AppChainNetwork
                  chain={webhook?.chain}
                  network={webhook?.network}
                />
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Type</Box>
              <Box className="value">{getNameWebhook(webhook?.type)}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Message today</Box>
              <Box className="value">{webhook?.messageToday}</Box>
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

  const fetchDataTable: any = async (params: any) => {
    try {
      const res: any = await rf
        .getRequest('RegistrationRequest')
        .getRegistrationsWithoutApp(params);

      const registrationIds =
        res?.docs?.map((item: IWebhook) => item?.registrationId) || [];

      const res24h: IWebhookStats[] = await rf
        .getRequest('NotificationRequest')
        .getWebhookStats24h(registrationIds);

      const dataWebhook = res?.docs?.map((webhook: IAppResponse) => {
        const webhookMetricToday = res24h.find(
          (item: IWebhookStats) =>
            item.registrationId === webhook.registrationId,
        );

        return {
          ...webhook,
          messageToday: webhookMetricToday?.message || '--',
        };
      });

      return {
        ...res,
        docs: dataWebhook,
      };
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
            Message(24hrs)
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

  const _renderListWebhookMobile = (data?: IWebhook[]) => {
    return (
      <Box className="list-card-mobile">
        {data?.map((webhook: IWebhook, index: number) => {
          return <WebhookMobile webhook={webhook} key={index} />;
        })}
      </Box>
    );
  };

  const _renderBody = (data?: IWebhook[]) => {
    if (isMobile) return _renderListWebhookMobile(data);
    return (
      <Tbody>
        {data?.map((webhook: IWebhook, index: number) => {
          return (
            <Tr
              key={index}
              className="tr-list"
              onClick={() =>
                history.push(`/webhooks/${webhook?.registrationId}`)
              }
            >
              <Td w="25%">{webhook?.webhookName}</Td>
              <Td w="20%">{getNameWebhook(webhook?.type)}</Td>
              <Td w="20%">
                <AppChainNetwork
                  chain={webhook?.chain}
                  network={webhook?.network}
                />
              </Td>
              <Td w="20%" textAlign={'center'}>
                {webhook?.messageToday}
              </Td>
              <Td w="15%" textAlign={'right'}>
                <AppStatus status={webhook?.status} />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  const _renderTotalWebhook = () => {
    if (!userStats?.totalRegistrationWithoutAppId) return;
    return (
      <Box className="number-app">
        <Text as={'span'}> Active Webhooks:</Text>{' '}
        {userStats?.totalRegistrationActiveWithoutAppId}/
        {userStats?.totalRegistrationWithoutAppId}
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

            <AppButton
              size={'sm'}
              onClick={() => history.push(ROUTES.CREATE_WEBHOOK)}
            >
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
