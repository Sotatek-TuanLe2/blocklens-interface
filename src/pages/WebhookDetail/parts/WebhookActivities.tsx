import { Tbody, Td, Th, Thead, Tr, Box, Text, Flex } from '@chakra-ui/react';
import React, { FC, useCallback, useState } from 'react';
import { AppButton, AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import ReactJson from 'react-json-view';
import 'src/styles/pages/AppDetail.scss';
import { formatShortText } from 'src/utils/utils-helper';

interface INotificationResponse {
  hash: string;
  userId: number;
  registrationId: number;
  type: string;
  status: string;
  statusCode: number;
  webhook: string;
  metadata: any;
  errs: string[];
  remainRetry: number;
  createdAt: number;
  updatedAt: number;
  address?: string;
}

interface INotificationItem {
  notification: INotificationResponse;
}

const enum STATUS {
  WAITING = 'WAITING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

interface IWebhookActivities {
  registrationId: string;
}

const getColorBrandStatus = (status: string) => {
  switch (status) {
    case STATUS.WAITING:
      return 'waiting';
    case STATUS.DONE:
      return 'active';
    case STATUS.FAILED:
      return 'inactive';
    default:
      return 'active';
  }
};

const NotificationItem: FC<INotificationItem> = ({ notification }) => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

  const _renderStatus = (notification: INotificationResponse) => {
    if (!notification.status) return 'N/A';
    return (
      <Box className={`status ${getColorBrandStatus(notification.status)}`}>
        {notification.status}
      </Box>
    );
  };

  return (
    <Tbody>
      <Tr
        cursor={'pointer'}
        className={`${isShowDetail ? 'dropdown-detail' : ''} tr-list`}
        onClick={() => setIsShowDetail(!isShowDetail)}
      >
        <Td>
          {formatTimestamp(
            notification.createdAt * 1000,
            'YYYY-MM-DD HH:mm:ss',
          )}{' '}
          UTC
        </Td>
        <Td>
          {formatTimestamp(
            notification.updatedAt * 1000,
            'YYYY-MM-DD HH:mm:ss',
          )}{' '}
          UTC
        </Td>
        <Td textAlign="center">
          {formatShortText(notification.address || '')}
        </Td>
        <Td textAlign="center">{notification.statusCode}</Td>
        <Td textAlign="center">{notification.remainRetry}</Td>
        <Td textAlign="right">{_renderStatus(notification)}</Td>
        <Td textAlign="right">
          {isShowDetail ? (
            <Box className="icon-eye" />
          ) : (
            <Box className="icon-eye-close" />
          )}
        </Td>
      </Tr>
      {isShowDetail && (
        <Tr className="dropdown-detail">
          <Td colSpan={7} borderBottom={0}>
            <ReactJson
              src={notification.metadata}
              displayDataTypes={false}
              displayObjectSize={false}
              name={null}
              style={{ backgroundColor: '#30384E', padding: '0 15px' }}
              theme="monokai"
            />
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

const WebhookActivities: FC<IWebhookActivities> = ({ registrationId }) => {
  const fetchDataTable: any = useCallback(async (param: any) => {
    try {
      return await rf.getRequest('NotificationRequest').getNotifications(param);
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const _renderHeader = () => {
    return (
      <Thead className="header-list">
        <Tr>
          <Th>Created At</Th>
          <Th>Updated At</Th>
          <Th>Address</Th>
          <Th textAlign="center">HTTP code</Th>
          <Th textAlign="center">Remain Retries</Th>
          <Th textAlign="right">Status</Th>
          <Th />
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
    <AppCard className="list-table-wrap">
      <Flex className="title-list-app">
        <Text className="text-title">Webhook Activities</Text>
        <Flex alignItems={'center'}>
          <AppButton size={'sm'} px={4} py={1} className={'btn-create'}>
            View All <Box className="icon-arrow-right" ml={2} />
          </AppButton>
        </Flex>
      </Flex>

      <AppDataTable
        requestParams={{ registrationId }}
        fetchData={fetchDataTable}
        renderBody={_renderBody}
        renderHeader={_renderHeader}
        limit={10}
      />
    </AppCard>
  );
};

export default WebhookActivities;
