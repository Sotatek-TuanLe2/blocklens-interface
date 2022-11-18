import { Tag, Tbody, Td, Th, Thead, Tr, Box, Flex } from '@chakra-ui/react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { BasePageContainer } from 'src/layouts/';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import ReactJson from 'react-json-view';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import 'src/styles/pages/AppDetail.scss';
import AppStatics from 'src/components/AppStats';
import { getLogoChainByName } from 'src/utils/utils-network';
import 'src/styles/pages/AppDetail.scss';
import ListWebhook from './AppDetail/parts/ListWebhook';

interface INotificationResponse {
  hash: string;
  userId: number;
  registrationId: number;
  type: string;
  status: number;
  statusCode: number;
  webhook: string;
  metadata: any;
  errs: string[];
  remainRetry: number;
  createdAt: number;
  updatedAt: number;
}

interface IWebhookStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
}

interface INotificationItem {
  notification: INotificationResponse;
}

interface IPartWebhookStats {
  registrationId: string;
}

const enum STATUS {
  WAITING = 1,
  PROCESSING = 2,
  DONE = 3,
  FAILED = 4,
}

const getStatus = (status: number) => {
  switch (status) {
    case STATUS.WAITING:
      return 'WAITING';
    case STATUS.PROCESSING:
      return 'PROCESSING';
    case STATUS.DONE:
      return 'DONE';
    case STATUS.FAILED:
      return 'FAILED';
  }
};

const getColorBrandStatus = (status: number) => {
  switch (status) {
    case STATUS.WAITING:
      return 'blue';
    case STATUS.PROCESSING:
      return 'teal';
    case STATUS.DONE:
      return 'green';
    case STATUS.FAILED:
      return 'red';
  }
};

const PartWebhookStatics: FC<IPartWebhookStats> = ({ registrationId }) => {
  const [webhookStats, setWebhookStats] = useState<IWebhookStats>({});

  const getWebhookStats = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getWebhookStats(registrationId)) as any;
      setWebhookStats(res);
    } catch (error: any) {
      setWebhookStats({});
    }
  }, [registrationId]);

  useEffect(() => {
    getWebhookStats().then();
  }, []);

  return <AppStatics type="WEBHOOK" stats={webhookStats} />;
};

const NotificationItem: FC<INotificationItem> = ({ notification }) => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

  const _renderStatus = (notification: INotificationResponse) => {
    if (!notification.status) return 'N/A';
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme={getColorBrandStatus(notification.status)}
        px={3}
      >
        {getStatus(notification.status)}
      </Tag>
    );
  };

  return (
    <Tbody>
      <Tr cursor={'pointer'} onClick={() => setIsShowDetail(!isShowDetail)}>
        <Td>{formatTimestamp(notification.createdAt * 1000)}</Td>
        <Td>{formatTimestamp(notification.updatedAt * 1000)}</Td>
        <Td>{notification.statusCode}</Td>
        <Td>{_renderStatus(notification)}</Td>
        <Td textAlign="right">{notification.remainRetry}</Td>
        <Td color={'#4C84FF'}>
          {isShowDetail ? (
            <>
              Hide <ChevronDownIcon />
            </>
          ) : (
            <>
              Show <ChevronUpIcon />
            </>
          )}
        </Td>
      </Tr>
      {isShowDetail && (
        <Tr>
          <Td colSpan={6} bg={'#E9EDF7'}>
            <ReactJson
              src={notification.metadata}
              displayDataTypes={false}
              displayObjectSize={false}
              name={null}
              theme="monokai"
              style={{ padding: '20px' }}
            />
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

const WebhookActivitiesPage = () => {
  const { id: registrationId, appId } = useParams<{
    id: string;
    appId: string;
  }>();
  const [params, setParams] = useState<any>({});
  const [totalWebhook, setTotalWebhook] = useState<any>();
  const [appInfo, setAppInfo] = useState<any>({});

  const fetchDataTable: any = useCallback(async (param: any) => {
    try {
      return await rf.getRequest('NotificationRequest').getNotifications(param);
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const getApp = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(appId)) as any;
      setAppInfo(res);
    } catch (error: any) {
      setAppInfo({});
    }
  }, [appId]);

  useEffect(() => {
    getApp().then();
  }, []);

  useEffect(() => {
    setParams({ registrationId });
  }, [registrationId]);

  const _renderHeader = () => {
    return (
      <Thead bg={'#f9f9f9'} h={'55px'}>
        <Tr>
          <Th>Created At</Th>
          <Th>Updated At</Th>
          <Th>HTTP code</Th>
          <Th>Status</Th>
          <Th textAlign="right">Remain Retries</Th>
          <Th>Request Body</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: INotificationResponse[]) => {
    return data?.map((notification: INotificationResponse, index: number) => {
      return <NotificationItem notification={notification} key={index} />;
    });
  };

  return (
    <BasePageContainer className={'app-detail'}>
      <>
        <Flex className="app-info">
          <Box>
            <Flex alignItems={'center'}>
              <Box className="name">{appInfo.name}</Box>
              <Flex ml={5} alignItems={'center'}>
                <Box
                  mr={2}
                  className={getLogoChainByName(appInfo?.chain) || ''}
                />
                {appInfo.chain + ' ' + appInfo.network}
              </Flex>
            </Flex>
            <Box className="description">{appInfo.description}</Box>
          </Box>
        </Flex>

        <Box className="name" my={5}>
          Webhook Activities
        </Box>

        <Box my={10}>
          <ListWebhook
            setTotalWebhook={setTotalWebhook}
            totalWebhook={totalWebhook}
            params={params}
            appInfo={appInfo}
            setParams={setParams}
            isDetail
          />
        </Box>

        <PartWebhookStatics registrationId={registrationId} />

        <AppCard p={0} pb={10} mt={10} className={'notification-table'}>
          <AppDataTable
            requestParams={{ registrationId }}
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderHeader={_renderHeader}
            limit={10}
          />
        </AppCard>
      </>
    </BasePageContainer>
  );
};

export default WebhookActivitiesPage;
