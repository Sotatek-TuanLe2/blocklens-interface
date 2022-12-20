import {
  Box,
  Flex,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import React, { FC, MouseEvent, useCallback, useMemo, useState } from 'react';
import {
  AppButton,
  AppCard,
  AppDataTable,
  AppInput,
  AppLink,
  AppSelect2,
} from 'src/components';
import rf from 'src/requests/RequestFactory';
import {
  filterParams,
  formatShortText,
  formatTimestamp,
} from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import 'src/styles/pages/AppDetail.scss';
import {
  ArrowRightIcon,
  FilterIcon,
  InfoIcon,
  LinkDetail,
  LinkIcon,
  RetryIcon,
} from 'src/assets/icons';
import {
  getColorBrandStatus,
  IWebhook,
  optionsFilter,
  STATUS,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { useHistory, useParams } from 'react-router';
import { isMobile } from 'react-device-detect';
import { getBlockExplorerUrl } from 'src/utils/utils-network';
import { IAppResponse } from 'src/utils/utils-app';
import 'src/styles/pages/HomePage.scss';

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
  tokenId: string[];
  method: string;
  retryTime: number;
  createdAt: number;
  updatedAt: number;
  trackingAddress: string;
}

interface INotificationItem {
  notification: INotificationResponse;
  webhook: IWebhook;
  appInfo: IAppResponse;
}

interface INotificationItemMobile {
  notification: INotificationResponse;
  webhook: IWebhook;
  isRetrying: boolean;
  appInfo: IAppResponse;
  onRetry: (e: MouseEvent<SVGSVGElement | HTMLButtonElement>) => void;
}

interface IWebhookActivities {
  registrationId: string;
  webhook: IWebhook;
  onShowAll?: () => void;
  isShowAll: boolean;
  appInfo: IAppResponse;
}

const _renderStatus = (
  notification: INotificationResponse,
  isRetrying: boolean,
) => {
  if (!notification.status) return 'N/A';

  if (isRetrying) {
    return (
      <Box className="status waiting">Retrying {notification.retryTime}/5</Box>
    );
  }

  return (
    <Box className={`status ${getColorBrandStatus(notification.status)}`}>
      {notification.status === STATUS.DONE ? 'Successful' : 'Failed'}
    </Box>
  );
};

const NotificationItemMobile: FC<INotificationItemMobile> = ({
  notification,
  webhook,
  isRetrying,
  appInfo,
  onRetry,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const _renderInfos = () => {
    const _renderInfoContractActivity = () => {
      return (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Method</Box>
          <Box className="value">
            <Flex alignItems="center">{notification.method}</Flex>
          </Box>
        </Flex>
      );
    };

    if (webhook.type === WEBHOOK_TYPES.ADDRESS_ACTIVITY) {
      return (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Address</Box>
          <Box className="value">
            <Flex alignItems="center">
              {formatShortText(notification?.metadata?.trackingAddress)}
            </Flex>
          </Box>
        </Flex>
      );
    }

    if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderInfoContractActivity();
    }

    return (
      <>
        {_renderInfoContractActivity()}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Token ID</Box>
          <Box className="value">
            <Flex alignItems="center">{notification.tokenId.join(', ')}</Flex>
          </Box>
        </Flex>
      </>
    );
  };
  return (
    <>
      <Box className={`${isOpen ? 'open' : ''} card-mobile`}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">
            {formatTimestamp(
              notification.createdAt * 1000,
              'YYYY-MM-DD HH:mm:ss',
            )}{' '}
            UTC
          </Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={() => setIsOpen(!isOpen)}
          />
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Status</Box>
          <Box>{_renderStatus(notification, isRetrying)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Block</Box>
              <Box className="value">{notification.metadata?.tx?.blockNumber}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>TXN ID</Box>
              <Box className="value">
                <Flex alignItems="center">
                  {formatShortText(
                    notification.metadata?.tx?.transactionHash,
                  )}
                  <Box ml={2}>
                    <a
                      href={`${
                        getBlockExplorerUrl(appInfo.chain, appInfo.network) +
                        `tx/${notification.metadata?.tx?.transactionHash}`
                      }`}
                      className="link-redirect"
                      target="_blank"
                    >
                      <LinkIcon />
                    </a>
                  </Box>
                </Flex>
              </Box>
            </Flex>
            {_renderInfos()}

            <Flex
              flexWrap={'wrap'}
              my={2}
              justifyContent={
                notification.status !== STATUS.DONE ? 'space-between' : 'center'
              }
            >
              {notification.status !== STATUS.DONE && (
                <Box width={'48%'}>
                  <AppButton
                    variant="cancel"
                    size="sm"
                    onClick={(e: any) => onRetry(e)}
                    w={'100%'}
                    isDisabled={webhook.status === WEBHOOK_STATUS.DISABLED}
                  >
                    Retry Now
                  </AppButton>
                </Box>
              )}

              <Box width={'48%'}>
                <AppLink
                  to={`/app/${appInfo.appId}/webhook/${webhook.registrationId}/activities/${notification.hash}`}
                >
                  <AppButton variant="cancel" size="sm" w={'100%'}>
                    More Details
                  </AppButton>
                </AppLink>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const NotificationItem: FC<INotificationItem> = ({
  notification,
  webhook,
  appInfo,
}) => {
  const history = useHistory();
  const isRetrying = useMemo(() => {
    return notification.retryTime < 5 && notification.status === STATUS.FAILED;
  }, [notification]);

  const onRetry = useCallback(
    async (e: MouseEvent<SVGSVGElement | HTMLButtonElement>) => {
      e.stopPropagation();

      if (webhook.status === WEBHOOK_STATUS.DISABLED) return;

      try {
        await rf
          .getRequest('NotificationRequest')
          .retryActivity(notification.hash);
        toastSuccess({ message: 'Successfully!' });
      } catch (error: any) {
        toastError({
          message: error?.message || 'Oops. Something went wrong!',
        });
      }
    },
    [],
  );

  const _renderContentContract = () => {
    return <Td textAlign="center">{notification.method}</Td>;
  };

  const _renderContentNFT = () => {
    return (
      <>
        {_renderContentContract()}
        <Td textAlign="center">{notification.tokenId.join(', ')}</Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return <Td>{formatShortText(notification?.metadata?.trackingAddress)}</Td>;
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

  if (isMobile)
    return (
      <NotificationItemMobile
        notification={notification}
        isRetrying={isRetrying}
        webhook={webhook}
        appInfo={appInfo}
        onRetry={onRetry}
      />
    );

  const onRedirectToBlockExplorer = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    return;
  };

  return (
    <Tbody>
      <Tr
        className="tr-list"
        onClick={() => {
          history.push(
            `/app/${appInfo.appId}/webhook/${webhook.registrationId}/activities/${notification.hash}`,
          );
        }}
      >
        <Td>
          {formatTimestamp(
            notification.createdAt * 1000,
            'YYYY-MM-DD HH:mm:ss',
          )}{' '}
          UTC
        </Td>
        <Td>{notification.metadata?.tx?.blockNumber}</Td>
        <Td>
          <Flex alignItems="center">
            {formatShortText(
              notification.metadata?.tx?.transactionHash,
            )}
            <Box ml={2}>
              <a
                onClick={(e) => onRedirectToBlockExplorer(e)}
                href={`${
                  getBlockExplorerUrl(appInfo.chain, appInfo.network) +
                  `tx/${notification.metadata?.tx?.transactionHash}`
                }`}
                className="link-redirect"
                target="_blank"
              >
                <LinkIcon />
              </a>
            </Box>
          </Flex>
        </Td>
        {_renderContentActivities()}
        <Td>{_renderStatus(notification, isRetrying)}</Td>
        <Td>
          <Flex>
            {notification.status !== STATUS.DONE && (
              <Box
                className="link-redirect"
                mr={3}
                cursor={
                  webhook.status === WEBHOOK_STATUS.DISABLED
                    ? 'not-allowed'
                    : 'pointer'
                }
              >
                <RetryIcon
                  onClick={(e: MouseEvent<SVGSVGElement>) => onRetry(e)}
                />
              </Box>
            )}

            <AppLink
              to={`/app/${appInfo.appId}/webhook/${webhook.registrationId}/activities/${notification.hash}`}
            >
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
  appInfo,
}) => {
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueFilter, setValueFilter] = useState<string>('');
  const { id: webhookId } = useParams<{ id: string }>();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf
        .getRequest('NotificationRequest')
        .getActivities(webhookId, filterParams(params));
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const _renderHeader = () => {
    if (isMobile) return;
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
          <Th>Block</Th>
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
              <Tooltip
                p={2}
                label="Messages for each activity will retry 5 times if send failed, each auto-retry occurs after one minute.
                 The status shows Failed if all retries failed or user’s daily limit is reached."
                placement={'top'}
                hasArrow
              >
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
    if (isMobile) {
      return (
        <Box className="list-card-mobile">
          {data?.map((notification: INotificationResponse, index: number) => {
            return (
              <NotificationItem
                notification={notification}
                key={index}
                webhook={webhook}
                appInfo={appInfo}
              />
            );
          })}
        </Box>
      );
    }

    return data?.map((notification: INotificationResponse, index: number) => {
      return (
        <NotificationItem
          notification={notification}
          key={index}
          webhook={webhook}
          appInfo={appInfo}
        />
      );
    });
  };

  const _renderBoxFilter = () => {
    return (
      <Flex className="box-filter activities-all" flex={'1 1 0'}>
        {!isMobile && (
          <Box width={'150px'}>
            <AppSelect2
              onChange={setValueFilter}
              options={optionsFilter}
              value={valueFilter}
            />
          </Box>
        )}

        <Box width={isMobile ? '85%' : '200px'}>
          <AppInput
            isSearch
            className={'input-search'}
            type="text"
            placeholder={'Search...'}
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value.trim())}
          />
        </Box>
        {isMobile && <Box className="icon-filter-mobile" />}
      </Flex>
    );
  };

  const _renderLinkShowAll = () => {
    return (
      <Flex alignItems={'center'} className="view-all link">
        <Box className="link" cursor={'pointer'} onClick={onShowAll} mr={2}>
          View More Activity
        </Box>
        <ArrowRightIcon />
      </Flex>
    );
  };

  return (
    <AppCard className="list-table-wrap">
      {isShowAll ? (
        _renderBoxFilter()
      ) : (
        <Flex className="title-list-app">
          <Text className="text-title">Recent Activities</Text>
          {!isMobile && _renderLinkShowAll()}
        </Flex>
      )}

      <AppDataTable
        requestParams={{
          status: valueFilter,
          search: valueSearch,
        }}
        hidePagination={!isShowAll}
        fetchData={fetchDataTable}
        renderBody={_renderBody}
        renderHeader={_renderHeader}
        limit={isShowAll ? 15 : 5}
      />

      {isMobile && !isShowAll && (
        <Flex justifyContent={'center'} my={4}>
          {_renderLinkShowAll()}
        </Flex>
      )}
    </AppCard>
  );
};

export default WebhookActivities;