import {
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Text,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import 'src/styles/pages/AppDetail.scss';
import { IWebhook, WEBHOOK_TYPES } from 'src/utils/utils-webhook';

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
  webhook: IWebhook;
}

const enum STATUS {
  WAITING = 'WAITING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

interface IWebhookActivities {
  registrationId: string;
  webhook: IWebhook;
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

const NotificationItem: FC<INotificationItem> = ({ notification, webhook }) => {
  const _renderStatus = (notification: INotificationResponse) => {
    if (!notification.status) return 'N/A';
    return (
      <Box className={`status ${getColorBrandStatus(notification.status)}`}>
        {notification.status}
      </Box>
    );
  };

  const _renderContentNFT = () => {
    return (
      <>
        <Td>N/A</Td>
        <Td textAlign="center">N/A</Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return <Td>N/A</Td>;
  };

  const _renderContentContract = () => {
    return <Td textAlign="center">method</Td>;
  };

  const _renderContentActivities = () => {
    if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderContentNFT();
    }

    if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderContentContract();
    }

    return _renderContentAddress();
  };

  return (
    <Tbody>
      <Tr className="tr-list">
        <Td>
          {formatTimestamp(
            notification.createdAt * 1000,
            'YYYY-MM-DD HH:mm:ss',
          )}{' '}
          UTC
        </Td>
        <Td>N/A</Td>
        {_renderContentActivities()}
        <Td>{_renderStatus(notification)}</Td>

        <Td>
          <Flex>
            {notification.status === STATUS.WAITING && (
              <Box className="icon-retry" />
            )}

            <Box className="icon-link-top" mx={4} />
            <Box className="icon-link" />
          </Flex>
        </Td>
      </Tr>
    </Tbody>
  );
};

const WebhookActivities: FC<IWebhookActivities> = ({
  registrationId,
  webhook,
}) => {
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
    const _renderHeaderNFT = () => {
      return (
        <>
          <Th>method</Th>
          <Th textAlign="center">token id</Th>
        </>
      );
    };

    const _renderHeaderAddress = () => {
      return <Th>Address</Th>;
    };

    const _renderHeaderContract = () => {
      return <Th textAlign="center">method</Th>;
    };

    const _renderHeaderActivities = () => {
      if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
        return _renderHeaderNFT();
      }

      if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
        return _renderHeaderContract();
      }

      return _renderHeaderAddress();
    };

    return (
      <Thead className="header-list">
        <Tr>
          <Th>Created At</Th>
          <Th>activity id</Th>
          {_renderHeaderActivities()}
          <Th>
            <Flex alignItems={'center'}>
              Status{' '}
              <Tooltip p={2} label="Status">
                <Box className="icon-info" ml={2} cursor={'pointer'} />
              </Tooltip>
            </Flex>
          </Th>
          <Th />
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: INotificationResponse[]) => {
    return data?.map((notification: INotificationResponse, index: number) => {
      return (
        <NotificationItem
          notification={notification}
          key={index}
          webhook={webhook}
        />
      );
    });
  };

  return (
    <AppCard className="list-table-wrap">
      <Flex className="title-list-app">
        <Text className="text-title">Recent Activies</Text>
        <Flex alignItems={'center'}>
          <AppLink to={'#'} className="link">
            View More Activity
          </AppLink>
          <Box className="icon-arrow-right" ml={2} />
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
