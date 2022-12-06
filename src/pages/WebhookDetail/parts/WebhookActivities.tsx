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
import React, { FC, useCallback, useMemo, useState } from 'react';
import {
  AppCard,
  AppDataTable,
  AppInput,
  AppLink,
  AppSelect2,
} from 'src/components';
import rf from 'src/requests/RequestFactory';
import { formatTimestamp } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import 'src/styles/pages/AppDetail.scss';
import {
  LinkIcon,
  FilterIcon,
  InfoIcon,
  RetryIcon,
  LinkDetail,
} from 'src/assets/icons';
import {
  IWebhook,
  WEBHOOK_TYPES,
  STATUS,
  getColorBrandStatus,
  optionsFilter,
} from 'src/utils/utils-webhook';
import { useParams } from 'react-router';
import _ from 'lodash';
import { isMobile } from "react-device-detect";

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
  retryTime: number;
  createdAt: number;
  updatedAt: number;
  address?: string;
}

interface INotificationItem {
  notification: INotificationResponse;
  webhook: IWebhook;
}

interface IWebhookActivities {
  registrationId: string;
  webhook: IWebhook;
  onShowAll?: () => void;
  isShowAll: boolean;
}

const NotificationItem: FC<INotificationItem> = ({ notification, webhook }) => {
  const isRetrying = useMemo(() => {
    return notification.retryTime < 5 && notification.status === STATUS.FAILED;
  }, [notification]);

  const _renderStatus = (notification: INotificationResponse) => {
    if (!notification.status) return 'N/A';

    if (isRetrying) {
      return (
        <Box className="status waiting">
          Retrying ${notification.retryTime}/5
        </Box>
      );
    }
    return (
      <Box className={`status ${getColorBrandStatus(notification.status)}`}>
        {notification.status}
      </Box>
    );
  };

  const onRetry = useCallback(async () => {
    try {
      await rf
        .getRequest('NotificationRequest')
        .retryActivity(notification.hash);
      toastSuccess({ message: 'Successfully!', });
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

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
        <Td>
          <Flex alignItems="center">
            {notification.hash}
            <AppLink ml={3} to={'#'} className="link-redirect">
              <LinkIcon />
            </AppLink>
          </Flex>
        </Td>
        {_renderContentActivities()}
        <Td>{_renderStatus(notification)}</Td>

        <Td>
          <Flex>
            {isRetrying && (
              <Box className="link-redirect">
                <RetryIcon onClick={onRetry} />
              </Box>
            )}

            <AppLink to={`/message-histories/${notification.hash}`}>
              <Box className="link-redirect">
                <LinkDetail />
              </Box>
            </AppLink>
          </Flex>
        </Td>
      </Tr>
    </Tbody>
  );
};

const WebhookActivities: FC<IWebhookActivities> = ({
  webhook,
  onShowAll,
  isShowAll,
}) => {
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueFilter, setValueFilter] = useState<string>('');
  const { id: webhookId } = useParams<{ id: string }>();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf
        .getRequest('NotificationRequest')
        .getActivities(webhookId, _.omitBy(params, _.isEmpty));
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
          <Th>
            <Flex alignItems="center">
              method
              {isShowAll && (
                <Box ml={2} className="filter-table">
                  <FilterIcon />
                </Box>
              )}
            </Flex>
          </Th>
          <Th textAlign="center">
            <Flex alignItems="center">
              token id
              {isShowAll && (
                <Box ml={2} className="filter-table">
                  <FilterIcon />
                </Box>
              )}
            </Flex>
          </Th>
        </>
      );
    };

    const _renderHeaderAddress = () => {
      return (
        <Th>
          <Flex alignItems="center">
            Address
            {isShowAll && (
              <Box ml={2} className="filter-table">
                <FilterIcon />
              </Box>
            )}
          </Flex>
        </Th>
      );
    };

    const _renderHeaderContract = () => {
      return (
        <Th textAlign="center">
          <Flex alignItems="center">
            method{' '}
            {isShowAll && (
              <Box ml={2} className="filter-table">
                <FilterIcon />
              </Box>
            )}
          </Flex>
        </Th>
      );
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
          <Th>
            <Flex alignItems="center">
              txn id{' '}
              {isShowAll && (
                <Box ml={2} className="filter-table">
                  <FilterIcon />
                </Box>
              )}
            </Flex>
          </Th>
          {_renderHeaderActivities()}
          <Th>
            <Flex alignItems={'center'}>
              Status{' '}
              <Tooltip p={2} label="Status" placement={'top'} hasArrow>
                <Box ml={2} cursor="pointer">
                  <InfoIcon />
                </Box>
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

  const _renderBoxFilter = () => {
    return (
      <Flex className="box-filter">
        <Box width={'150px'}>
          <AppSelect2
            onChange={setValueFilter}
            options={optionsFilter}
            value={valueFilter}
          />
        </Box>
        <Box width={'200px'}>
          <AppInput
            isSearch
            className={'input-search'}
            type="text"
            placeholder={'Search...'}
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value.trim())}
          />
        </Box>
      </Flex>
    );
  };

  return (
    <AppCard className="list-table-wrap">
      {isShowAll ? (
        _renderBoxFilter()
      ) : (
        <Flex className="title-list-app">
          <Text className="text-title">Recent Activies</Text>
          <Flex alignItems={'center'} className="view-all">
            <Box className="link" cursor={'pointer'} onClick={onShowAll}>
              View More Activity
            </Box>
            <Box className="icon-arrow-right" ml={2} />
          </Flex>
        </Flex>
      )}

      <AppDataTable
        requestParams={{
          status: valueFilter,
          search: valueSearch,
        }}
        fetchData={fetchDataTable}
        renderBody={_renderBody}
        renderHeader={_renderHeader}
        limit={isShowAll ? 15 : 10}
      />
    </AppCard>
  );
};

export default WebhookActivities;
