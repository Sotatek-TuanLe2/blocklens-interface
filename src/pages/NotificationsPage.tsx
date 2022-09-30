import { Tag, Tbody, Td, Text, Th, Thead, Tr, Box } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router';
import { AppCard, AppDataTable } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { BasePageContainer } from 'src/layouts/';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import ReactJson from 'react-json-view';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'

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

interface INotificationItem {
  notification: INotificationResponse;
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
        <Td color={'brand.500'} className={'link-webhook'}>
          <a href={notification.webhook} target={'_blank'}>
            {notification.webhook}
          </a>
        </Td>
        <Td>{_renderStatus(notification)}</Td>
        <Td>{notification.remainRetry}</Td>
        <Td fontSize={'18px'} >
          {isShowDetail ? <ChevronDownIcon /> : <ChevronUpIcon /> }

        </Td>
      </Tr>
      {isShowDetail && (
        <Tr>
          <Td colSpan={6} bg={'#E9EDF7'}>
            <Text fontSize={'16px'} mb={3}>
              Request Body:
            </Text>
            <ReactJson
              src={notification.metadata}
              displayDataTypes={false}
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

const NotificationsPage = () => {
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
          <Th>Webhook</Th>
          <Th>Status</Th>
          <Th>Remain time</Th>
          <Th></Th>
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
          Notifications
        </Text>
        <AppCard p={0} pb={10} className={'notification-table'}>
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

export default NotificationsPage;
