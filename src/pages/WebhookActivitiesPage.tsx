import {
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { BasePageContainer } from 'src/layouts/';
import { formatLargeNumber, formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import ReactJson from 'react-json-view';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import 'src/styles/pages/AppDetail.scss';

interface INotificationResponse {
  hash: string;
  userId: number;
  registrationId: number;
  type: string;
  status: number;
  webhook: string;
  metadata: any;
  errs: string[];
  remainRetry: number;
  createdAt: number;
  updatedAt: number;
}

interface IWebhookStatistics {
  totalThisMonth?: number;
  totalLast24Hours?: number;
  totalSuccessLast24Hours?: number;
}

interface INotificationItem {
  notification: INotificationResponse;
}

interface IPartWebhookStatics {
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

const PartWebhookStatics: FC<IPartWebhookStatics> = ({ registrationId }) => {
  const [webhookStatistics, setWebhookStatistics] =
    useState<IWebhookStatistics>({});

  const getWebhookStatistics = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getWebhookStatistics(registrationId)) as any;
      setWebhookStatistics(res);
    } catch (error: any) {
      setWebhookStatistics({});
    }
  }, [registrationId]);

  useEffect(() => {
    getWebhookStatistics().then();
  }, []);

  const getPercentNotificationSuccess = () => {
    if (
      !webhookStatistics.totalLast24Hours ||
      !webhookStatistics.totalSuccessLast24Hours
    ) {
      return '--';
    }

    return (
      (webhookStatistics?.totalSuccessLast24Hours /
        webhookStatistics?.totalLast24Hours) *
      100
    ).toFixed(2);
  };

  return (
    <SimpleGrid
      className="infos"
      columns={{ base: 1, sm: 2, lg: 4 }}
      gap="20px"
    >
      <AppCard p={4} className="box-info">
        <Box className="label">
          Webhook’s Notifications <br />
          This Month
        </Box>
        <Box className="value">
          {formatLargeNumber(webhookStatistics.totalThisMonth)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          Webhook’s Notifications
          <br />
          Last 24 Hour
        </Box>
        <Box className="value">
          {formatLargeNumber(webhookStatistics.totalLast24Hours)}
        </Box>
      </AppCard>

      <AppCard p={4} className="box-info">
        <Box className="label">
          Webhook’s Success %<br />
          Last 24 hour
        </Box>
        <Box className="value">{getPercentNotificationSuccess()}</Box>
      </AppCard>
    </SimpleGrid>
  );
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
        <Td>N/A</Td>
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
  const { id: registrationId } = useParams<{ id: string }>();

  const fetchDataTable: any = async (param: any) => {
    try {
      return await rf.getRequest('NotificationRequest').getNotifications(param);
    } catch (error: any) {
      toastError({ message: error?.message || 'Oops. Something went wrong!' });
    }
  };

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
    <BasePageContainer>
      <>
        <Text fontSize={'24px'} mb={5}>
          Webhook Activities
        </Text>

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
