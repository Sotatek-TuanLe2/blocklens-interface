import { Box, Flex, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import React, { useState, useCallback, FC, MouseEvent } from 'react';
import rf from 'src/requests/RequestFactory';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { _renderStatus } from 'src/pages/WebhookDetail/parts/PartWebhookActivities';
import {
  IActivityResponse,
  IWebhook,
  optionsFilter,
  STATUS,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import {
  AppButton,
  AppCard,
  AppDataTable,
  AppHeading,
  AppInput,
  AppLink,
  AppFilter,
} from 'src/components';
import { isMobile } from 'react-device-detect';
import ModalFilterActivities from '../modals/ModalFilterActivities';
import {
  filterParams,
  formatShortText,
  formatTimestamp,
} from '../utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { InfoIcon, LinkDetail, LinkIcon, RetryIcon } from 'src/assets/icons';
import { getBlockExplorerUrl } from 'src/utils/utils-network';
import { IAppResponse } from 'src/utils/utils-app';
import useAppDetails from 'src/hooks/useAppDetails';
import useWebhookDetails from 'src/hooks/useWebhook';

interface IActivity {
  activity: IActivityResponse;
  webhook: IWebhook;
  appInfo: IAppResponse;
  onReload: () => void;
}

export const onRetry = async (
  e: MouseEvent<SVGSVGElement | HTMLButtonElement>,
  activity: IActivityResponse,
  webhook: IWebhook,
  onReload: () => void,
) => {
  e.stopPropagation();

  if (webhook.status === WEBHOOK_STATUS.DISABLED) return;

  try {
    await rf.getRequest('NotificationRequest').retryActivity(activity.hash);
    toastSuccess({ message: 'Retried!' });
    onReload();
  } catch (error: any) {
    toastError({
      message: error?.message || 'Oops. Something went wrong!',
    });
  }
};

const ActivityMobile: FC<IActivity> = ({
  activity,
  webhook,
  appInfo,
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
              {activity?.metadata?.tokenId || '--'}
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
                      href={`${
                        getBlockExplorerUrl(appInfo.chain, appInfo.network) +
                        `tx/${activity?.metadata?.tx?.transactionHash}`
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
                activity?.status !== STATUS.DONE ? 'space-between' : 'center'
              }
            >
              {activity?.status !== STATUS.DONE && (
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
                  to={`/app/${appInfo.appId}/webhook/${webhook.registrationId}/activities/${activity?.hash}`}
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
  appInfo,
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
          {activity?.metadata?.tokenId || '--'}
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
            `/app/${appInfo.appId}/webhook/${webhook.registrationId}/activities/${activity.hash}`,
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
                href={`${
                  getBlockExplorerUrl(appInfo.chain, appInfo.network) +
                  `tx/${activity.metadata?.tx?.transactionHash}`
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
        <Td w="15%" textAlign={'center'}>
          {_renderStatus(activity)}
        </Td>
        <Td w="15%">
          <Flex justifyContent={'flex-end'}>
            {activity.status !== STATUS.DONE && (
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
              to={`/app/${appInfo.appId}/webhook/${webhook.registrationId}/activities/${activity.hash}`}
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

const AllActivitiesPage = () => {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const { appInfo } = useAppDetails(appId);
  const { webhook } = useWebhookDetails(appId, webhookId);

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

    const _renderHeaderContract = () => {
      return (
        <Th
          textAlign="center"
          w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '13%' : '15%'}
        >
          <Flex alignItems="center">
            method
            <AppFilter value={method} onChange={setMethod} type="method" />
          </Flex>
        </Th>
      );
    };

    const _renderHeaderAddress = () => {
      return (
        <Th w="15%">
          <Flex alignItems="center">
            Address
            <AppFilter value={address} onChange={setAddress} type="address" />
          </Flex>
        </Th>
      );
    };

    const _renderHeaderNFT = () => {
      return (
        <>
          {_renderHeaderContract()}
          <Th textAlign="center" w="10%">
            <Flex alignItems="center" justifyContent={'center'}>
              token id
              <AppFilter
                value={tokenId}
                onChange={setTokenId}
                type="token ID"
              />
            </Flex>
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
            <Flex alignItems="center">
              txn id
              <AppFilter value={txHash} onChange={setTxHash} type="txn ID" />
            </Flex>
          </Th>
          {_renderHeaderActivities()}
          <Th w="15%">
            <Flex alignItems={'center'} justifyContent={'center'}>
              Status
              <AppFilter
                value={status}
                onChange={setStatus}
                type="status"
                options={optionsFilter}
              />
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

  const _renderListActivityMobile = (data?: IActivityResponse[]) => {
    return (
      <Box className="list-card-mobile">
        {data?.map((activity: IActivityResponse, index: number) => {
          return (
            <ActivityMobile
              activity={activity}
              key={index}
              webhook={webhook}
              appInfo={appInfo}
              onReload={forceUpdate}
            />
          );
        })}
      </Box>
    );
  };

  const _renderListActivityDesktop = (data?: IActivityResponse[]) => {
    return data?.map((activity: IActivityResponse, index: number) => {
      return (
        <ActivityDesktop
          activity={activity}
          key={index}
          webhook={webhook}
          appInfo={appInfo}
          onReload={forceUpdate}
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
            value={search}
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

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <AppHeading
            isCenter
            title="All Activities"
            linkBack={`/app/${appId}/webhooks/${webhookId}`}
          />
        </Flex>

        <AppCard className="list-table-wrap">
          {_renderBoxFilter()}

          <AppDataTable
            requestParams={{
              status,
              search,
              method,
              address,
              txHash,
              tokenId,
            }}
            hidePagination
            fetchData={fetchDataTable}
            renderBody={(data) =>
              isMobile
                ? _renderListActivityMobile(data)
                : _renderListActivityDesktop(data)
            }
            renderHeader={_renderHeader}
            limit={15}
          />

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
      </>
    </BasePageContainer>
  );
};

export default AllActivitiesPage;
