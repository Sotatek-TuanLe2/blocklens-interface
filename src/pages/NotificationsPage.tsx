import { Tag, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router';
import { AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { BasePageContainer } from 'src/layouts/';
import { formatTimestamp } from 'src/utils/utils-helper';

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

const enum STATUS {
  WAITING = 1,
  PROCESSING = 2,
  DONE = 3,
  FAILED = 4
}

const getStatus = (status: number) => {
  switch (status) {
    case STATUS.WAITING: return 'WAITING';
    case STATUS.PROCESSING: return 'PROCESSING';
    case STATUS.DONE: return 'DONE';
    case STATUS.FAILED: return 'FAILED';
  }
};

const getColorBrandStatus = (status: number) => {
  switch (status) {
    case STATUS.WAITING: return 'blue';
    case STATUS.PROCESSING: return 'teal';
    case STATUS.DONE: return 'green';
    case STATUS.FAILED: return 'red';
  }
};

const NotificationsPage = () => {
  const { id: registrationId } = useParams<{ id: string }>();

  const fetchDataTable: any = async (param: any) => {
    try {
      return await rf.getRequest('NotificationRequest').getNotifications(param);
    } catch (error) {
      return error;
    }
  };

  const _renderHeader = () => {
    return (
      <Thead bg={'#f9f9f9'}>
        <Tr>
          <Th>Created At</Th>
          <Th>Updated At</Th>
          <Th>Webhook</Th>
          <Th>Status</Th>
          <Th>Remain time</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderStatus = (notification: INotificationResponse) => {
    if (!notification.status) return 'N/A';
    return (
      <Tag
        size={'sm'}
        borderRadius="full"
        variant="solid"
        colorScheme={getColorBrandStatus(notification.status)}
        px={5}
      >
        {getStatus(notification.status)}
      </Tag>
    );
  };

  const _renderBody = (data?: INotificationResponse[]) => {
    return (
      <Tbody>
        {data?.map((notification: INotificationResponse, index: number) => {
          return (
            <Tr key={index} className="tr-list-app">
              <Td>{formatTimestamp(notification.createdAt * 1000)}</Td>
              <Td>{formatTimestamp(notification.updatedAt * 1000)}</Td>
              <Td>
                <AppLink
                  to={notification.webhook}
                  width={'250px'}
                  whiteSpace={'nowrap'}
                  textOverflow={'ellipsis'}
                  overflow={'hidden'}
                  display={'block'}
                >
                  {notification.webhook}
                </AppLink>
              </Td>
              <Td>{_renderStatus(notification)}</Td>
              <Td>{notification.remainRetry}</Td>
            </Tr>
          );
        })}
      </Tbody>
    );
  };

  return (
    <BasePageContainer>
      <>
        <Text fontSize={'24px'} mb={5}>
          Notifications
        </Text>
        <AppCard p={0} pb={10}>
          <AppDataTable
            requestParams={{ registrationId: +registrationId }}
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

export default NotificationsPage;
