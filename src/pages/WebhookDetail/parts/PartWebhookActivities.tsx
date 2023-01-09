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
import React, { FC, MouseEvent, useCallback, useState } from 'react';
import { AppButton, AppCard, AppDataTable, AppLink } from 'src/components';
import rf from 'src/requests/RequestFactory';
import { formatShortText, formatTimestamp } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import 'src/styles/pages/NotificationPage.scss';
import 'src/styles/pages/AppDetail.scss';
import {
  ArrowRightIcon,
  InfoIcon,
  LinkDetail,
  LinkIcon,
  RetryIcon,
} from 'src/assets/icons';
import {
  getColorBrandStatus,
  IWebhook,
  IActivityResponse,
  STATUS,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { useHistory, useParams } from 'react-router';
import { isMobile } from 'react-device-detect';
import { getBlockExplorerUrl } from 'src/utils/utils-network';
import 'src/styles/pages/HomePage.scss';
import { onRetry } from 'src/pages/AllActivitiesPage';

interface IActivity {
  activity: IActivityResponse;
  webhook: IWebhook;
  onReload: () => void;
}

interface IPartRecentActivities {
  webhook: IWebhook;
}

export const _renderStatus = (activity: IActivityResponse) => {
  if (!activity?.lastStatus) return '--';

  if (activity?.retryTime > 0) {
    return (
      <Box className="status waiting">Processing {activity?.retryTime}/5</Box>
    );
  }

  return (
    <Box className={`status ${getColorBrandStatus(activity?.lastStatus)}`}>
      {activity?.lastStatus === STATUS.DONE ? 'Successful' : 'Failed'}
    </Box>
  );
};

const ActivityMobile: FC<IActivity> = ({
  activity,
  webhook,
  onReload,
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
            <Flex alignItems="center">{activity?.metadata?.method}</Flex>
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
              {formatShortText(activity?.metadata?.trackingAddress)}
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
              {activity?.metadata?.tokenIds?.join(', ') || '--'}
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
            {formatTimestamp(activity?.createdAt * 1000, 'YYYY-MM-DD HH:mm:ss')}{' '}
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
          <Box>{_renderStatus(activity)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Block</Box>
              <Box className="value">{activity?.metadata?.tx?.blockNumber}</Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>TXN ID</Box>
              <Box className="value">
                <Flex alignItems="center">
                  {formatShortText(activity?.metadata?.tx?.transactionHash)}
                  <Box ml={2}>
                    <a
                      href={
                        getBlockExplorerUrl(webhook?.chain, webhook?.network) +
                        activity?.metadata?.tx?.transactionHash
                      }
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
                activity?.lastStatus !== STATUS.DONE ? 'space-between' : 'center'
              }
            >
              {activity?.lastStatus !== STATUS.DONE && (
                <Box width={'48%'}>
                  <AppButton
                    variant="cancel"
                    size="sm"
                    onClick={(e: any) =>
                      onRetry(e, activity, webhook, onReload)
                    }
                    w={'100%'}
                    isDisabled={webhook.status === WEBHOOK_STATUS.DISABLED}
                  >
                    Retry Now
                  </AppButton>
                </Box>
              )}

              <Box width={'48%'}>
                <AppLink
                  to={`/app/${webhook?.appId}/webhook/${webhook.registrationId}/activities/${activity?.hash}`}
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

const ActivityDesktop: FC<IActivity> = ({
  activity,
  webhook,
  onReload,
}) => {
  const history = useHistory();

  const _renderContentContract = () => {
    return <Td w="15%">{activity?.metadata?.method}</Td>;
  };

  const _renderContentNFT = () => {
    return (
      <>
        <Td w="13%">{activity?.metadata?.method}</Td>
        <Td textAlign="center" w="10%">
          {activity?.metadata?.tokenIds?.join(', ') || '*'}
        </Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return (
      <Td w="15%">{formatShortText(activity?.metadata?.trackingAddress)}</Td>
    );
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
            `/app/${webhook?.appId}/webhook/${webhook.registrationId}/activities/${activity.hash}`,
          );
        }}
      >
        <Td w="25%">
          {formatTimestamp(activity.createdAt * 1000, 'YYYY-MM-DD HH:mm:ss')}{' '}
          UTC
        </Td>
        <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '12%' : '15%'}>
          {activity.metadata?.tx?.blockNumber}
        </Td>
        <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '15%' : '20%'}>
          <Flex alignItems="center">
            {formatShortText(activity.metadata?.tx?.transactionHash)}
            <Box ml={2}>
              <a
                onClick={(e) => onRedirectToBlockExplorer(e)}
                href={
                  getBlockExplorerUrl(webhook?.chain, webhook?.network) +
                  activity.metadata?.tx?.transactionHash
                }
                className="link-redirect"
                target="_blank"
              >
                <LinkIcon />
              </a>
            </Box>
          </Flex>
        </Td>
        {_renderContentActivities()}
        <Td w="15%" textAlign={'center'}>
          {_renderStatus(activity)}
        </Td>
        <Td w="15%">
          <Flex justifyContent={'flex-end'}>
            {activity.lastStatus !== STATUS.DONE && (
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
                  onClick={(e: MouseEvent<SVGSVGElement>) =>
                    onRetry(e, activity, webhook, onReload)
                  }
                />
              </Box>
            )}

            <AppLink
              to={`/app/${webhook?.appId}/webhook/${webhook.registrationId}/activities/${activity.hash}`}
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

const PartWebhookActivities: FC<IPartRecentActivities> = ({
  webhook,
}) => {
  const { id: webhookId } = useParams<{ id: string }>();
  const [, updateState] = useState<any>();
  const history = useHistory();

  const forceUpdate = useCallback(() => updateState({}), []);

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf
        .getRequest('NotificationRequest')
        .getActivities(webhookId, params);
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const onRetry = useCallback(
    async (
      e: MouseEvent<SVGSVGElement | HTMLButtonElement>,
      activity: IActivityResponse,
    ) => {
      e.stopPropagation();

      if (webhook.status === WEBHOOK_STATUS.DISABLED) return;

      try {
        await rf.getRequest('NotificationRequest').retryActivity(activity.hash);
        toastSuccess({ message: 'Retried!' });
        forceUpdate();
      } catch (error: any) {
        toastError({
          message: error?.message || 'Oops. Something went wrong!',
        });
      }
    },
    [],
  );

  const _renderHeader = () => {
    if (isMobile) return;

    const _renderHeaderContract = () => {
      return (
        <Th
          textAlign="center"
          w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '13%' : '15%'}
        >
          method
        </Th>
      );
    };

    const _renderHeaderAddress = () => {
      return <Th w="15%">Address</Th>;
    };

    const _renderHeaderNFT = () => {
      return (
        <>
          {_renderHeaderContract()}
          <Th textAlign="center" w="10%">
            token id
          </Th>
        </>
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
          <Th w="25%">Created At</Th>
          <Th w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '12%' : '15%'}>
            Block
          </Th>
          <Th w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '15%' : '20%'}>
            txn id
          </Th>
          {_renderHeaderActivities()}
          <Th w="15%">
            <Flex alignItems={'center'} justifyContent={'center'}>
              Status
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
          <Th w="15%" />
        </Tr>
      </Thead>
    );
  };

  const _renderListActivityDesktop = (data?: IActivityResponse[]) => {
    return data?.map((activity: IActivityResponse, index: number) => {
      return (
        <ActivityDesktop
          activity={activity}
          key={index}
          webhook={webhook}
          onReload={forceUpdate}
        />
      );
    });
  };

  const _renderListActivityMobile = (data?: IActivityResponse[]) => {
    return (
      <Box className="list-card-mobile">
        {data?.map((activity: IActivityResponse, index: number) => {
          return (
            <ActivityMobile
              activity={activity}
              key={index}
              webhook={webhook}
              onReload={forceUpdate}
            />
          );
        })}
      </Box>
    );
  };

  const _renderLinkShowAll = () => {
    return (
      <Flex alignItems={'center'} className="view-all link">
        <Box
          className="link"
          cursor={'pointer'}
          onClick={() =>
            history.push(
              `/app/${webhook?.appId}/webhooks/${webhookId}/activities`,
            )
          }
          mr={2}
        >
          View More Activity
        </Box>
        <ArrowRightIcon />
      </Flex>
    );
  };

  return (
    <AppCard className="list-table-wrap">
      <Flex className="title-list-app">
        <Text className="text-title">Recent Activities</Text>
        {!isMobile && _renderLinkShowAll()}
      </Flex>

      <AppDataTable
        hidePagination
        fetchData={fetchDataTable}
        renderBody={(data) =>
          isMobile
            ? _renderListActivityMobile(data)
            : _renderListActivityDesktop(data)
        }
        renderHeader={_renderHeader}
        limit={5}
      />

      {isMobile && (
        <Flex justifyContent={'center'} my={4}>
          {_renderLinkShowAll()}
        </Flex>
      )}
    </AppCard>
  );
};

export default PartWebhookActivities;
