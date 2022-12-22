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
import React, {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AppButton,
  AppCard,
  AppDataTable,
  AppInput,
  AppLink,
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
import ModalFilterActivities from 'src/modals/ModalFilterActivities';

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
  onReloadData: () => void;
}

interface INotificationItemMobile {
  notification: INotificationResponse;
  webhook: IWebhook;
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

interface IOption {
  value: string;
  label: string;
}

interface IFilter {
  value: string;
  onChange: (value: string) => void;
  type: string;
  options?: IOption[];
}

const _renderStatus = (notification: INotificationResponse) => {
  if (!notification.status) return '--';

  if (notification.status === STATUS.PROCESSING) {
    return (
      <Box className="status waiting">
        Processing {notification.retryTime}/5
      </Box>
    );
  }

  return (
    <Box className={`status ${getColorBrandStatus(notification.status)}`}>
      {notification.status === STATUS.DONE ? 'Successful' : 'Failed'}
    </Box>
  );
};

export const Filter: FC<IFilter> = ({ value, onChange, type, options }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Box
      ml={2}
      className={`filter-table ${isOpen || !!value ? 'active' : ''}`}
      ref={ref}
    >
      <FilterIcon onClick={() => setIsOpen(true)} />

      {isOpen && (
        <>
          {type === 'status' ? (
            <Box className="filter-table__options">
              {!!options &&
                options.map((item: any, index: number) => {
                  return (
                    <Box
                      className={`filter-table__option ${
                        item.value === value ? 'active' : ''
                      }`}
                      onClick={() => {
                        onChange(item?.value);
                        setIsOpen(false);
                      }}
                      key={index}
                    >
                      {item.label}
                    </Box>
                  );
                })}
            </Box>
          ) : (
            <Box className="filter-table__box-search">
              <AppInput
                className={'input-search'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Select ${type}`}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const NotificationItemMobile: FC<INotificationItemMobile> = ({
  notification,
  webhook,
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
            <Flex alignItems="center">{notification.metadata.method}</Flex>
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
            <Flex alignItems="center">
              {notification.metadata?.tokenId || '--'}
            </Flex>
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
          <Box>{_renderStatus(notification)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Block</Box>
              <Box className="value">
                {notification.metadata?.tx?.blockNumber}
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>TXN ID</Box>
              <Box className="value">
                <Flex alignItems="center">
                  {formatShortText(notification.metadata?.tx?.transactionHash)}
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
  onReloadData,
}) => {
  const history = useHistory();

  const onRetry = useCallback(
    async (e: MouseEvent<SVGSVGElement | HTMLButtonElement>) => {
      e.stopPropagation();

      if (webhook.status === WEBHOOK_STATUS.DISABLED) return;

      try {
        await rf
          .getRequest('NotificationRequest')
          .retryActivity(notification.hash);
        toastSuccess({ message: 'Retried!' });
        onReloadData();
      } catch (error: any) {
        toastError({
          message: error?.message || 'Oops. Something went wrong!',
        });
      }
    },
    [],
  );

  const _renderContentContract = () => {
    return <Td textAlign="left">{notification?.metadata?.method}</Td>;
  };

  const _renderContentNFT = () => {
    return (
      <>
        {_renderContentContract()}
        <Td textAlign="center">{notification?.metadata?.tokenId || '--'}</Td>
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
            {formatShortText(notification.metadata?.tx?.transactionHash)}
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
        <Td>{_renderStatus(notification)}</Td>
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
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
  const { id: webhookId } = useParams<{ id: string }>();
  const [, updateState] = useState<any>();

  const forceUpdate = useCallback(() => updateState({}), []);

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
                <Filter value={method} onChange={setMethod} type="method" />
              )}
            </Flex>
          </Th>
          <Th textAlign="center">
            <Flex alignItems="center">
              token id
              {isShowAll && (
                <Filter value={tokenId} onChange={setTokenId} type="token ID" />
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
              <Filter value={address} onChange={setAddress} type="address" />
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
              <Filter value={method} onChange={setMethod} type="method" />
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
                <Filter value={txHash} onChange={setTxHash} type="txn ID" />
              )}
            </Flex>
          </Th>
          {_renderHeaderActivities()}
          <Th>
            <Flex alignItems={'center'}>
              Status{' '}
              {isShowAll && (
                <Filter
                  value={status}
                  onChange={setStatus}
                  type="status"
                  options={optionsFilter}
                />
              )}
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
                onReloadData={forceUpdate}
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
          onReloadData={forceUpdate}
        />
      );
    });
  };

  const _renderBoxFilter = () => {
    if (!isMobile) return <Box p={5} />;
    return (
      <Flex className="box-filter activities-all" flex={'1 1 0'}>
        <Box width={'85%'}>
          <AppInput
            isSearch
            className={'input-search'}
            type="text"
            placeholder={'Search...'}
            value={status}
            onChange={(e) => setSearch(e.target.value.trim())}
          />
        </Box>
        <Box
          className="icon-filter-mobile"
          onClick={() => setIsOpenFilterModal(true)}
        />
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
          status,
          search,
          method,
          address,
          txHash,
          tokenId,
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

      {isOpenFilterModal && (
        <ModalFilterActivities
          open={isOpenFilterModal}
          value={status}
          onClose={() => setIsOpenFilterModal(false)}
          onChange={setStatus}
          options={optionsFilter}
        />
      )}
    </AppCard>
  );
};

export default WebhookActivities;
