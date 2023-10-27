import { Box, Flex, Tbody, Td, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import React, { FC, MouseEvent, useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useHistory, useParams } from 'react-router';
import { LinkDetail, LinkIcon } from 'src/assets/icons';
import {
  AppButton,
  AppDataTable,
  AppFilter,
  AppLink,
  AppLoadingTable,
  RequestParams,
} from 'src/components';
import useWebhookDetails from 'src/hooks/useWebhook';
import 'src/styles/pages/AppDetail.scss';
import { getExplorerTxUrl } from 'src/utils/utils-network';
import {
  formatTokenData,
  getColorBrandStatus,
  IActivityResponse,
  IWebhook,
  optionsFilter,
  STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import ModalUpgradeMessage from '../modals/ModalUpgradeMessage';
import {
  formatShortText,
  formatTimestamp,
  formatCapitalize,
  shortAddressType,
} from '../utils/utils-helper';

interface IActivity {
  activity: IActivityResponse;
  webhook: IWebhook;
  onReload: () => void;
}

export const getWidthColumns = (webhook: IWebhook) => {
  if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
    return [25, 12, 15, 13, 10, 15, 15];
  }

  if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
    return [25, 15, 15, 15, 15, 15];
  }

  return [25, 15, 15, 15, 15, 15];
};

const _renderStatus = (activity: IActivityResponse) => {
  if (!activity?.lastStatus) return '--';

  if (activity?.lastStatus === STATUS.PROCESSING) {
    return (
      <Box className="status waiting">
        Processing
        {/*{activity?.retryTime}/5*/}
      </Box>
    );
  }

  return (
    <Box className={`status ${getColorBrandStatus(activity?.lastStatus)}`}>
      {activity?.lastStatus === STATUS.DONE ? 'Successful' : 'Failed'}
    </Box>
  );
};

const ActivityMobile: FC<IActivity> = ({ activity, webhook }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openModalUpgradeMessage, setOpenUpgradeMessage] = useState(false);

  const isAddressActivity = webhook.type === WEBHOOK_TYPES.ADDRESS_ACTIVITY;

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
            <Flex alignItems="center">
              {activity?.metadata?.method || '--'}
            </Flex>
          </Box>
        </Flex>
      );
    };

    if (isAddressActivity) {
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

    if (webhook.type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
      return (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Coin Type</Box>
          <Box className="value">
            <Flex alignItems="center">
              {shortAddressType(webhook?.metadata?.coinType || '')}
            </Flex>
          </Box>
        </Flex>
      );
    }

    if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
      return (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Token Data</Box>
          <Box className="value">
            <Flex alignItems="center">{formatTokenData(webhook)}</Flex>
          </Box>
        </Flex>
      );
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
              {activity?.metadata?.tx?.tokenIds?.join(', ') || '*'}
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
              activity?.metadata?.tx?.timestamp * 1000,
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
              <Box className="value">
                {activity?.metadata?.tx?.block || '--'}
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
                  {formatShortText(activity?.transactionHash)}
                  {activity?.transactionHash && (
                    <Box ml={2}>
                      <a
                        href={getExplorerTxUrl(
                          webhook?.chain,
                          webhook?.network,
                          activity?.transactionHash,
                        )}
                        className="link-redirect"
                        target="_blank"
                      >
                        <LinkIcon />
                      </a>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Flex>
            {_renderInfos()}

            <Flex flexWrap={'wrap'} my={2} justifyContent={'center'}>
              <Box width={'48%'}>
                <AppLink
                  to={`/webhook/${webhook.registrationId}/activities/${activity?.hash}`}
                >
                  <AppButton variant="brand" size="sm" w={'100%'}>
                    More Details
                  </AppButton>
                </AppLink>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
      <ModalUpgradeMessage
        open={openModalUpgradeMessage}
        onClose={() => setOpenUpgradeMessage(false)}
      />
    </>
  );
};

const ActivityDesktop: FC<IActivity> = ({ activity, webhook }) => {
  const history = useHistory();
  const [openModalUpgradeMessage, setOpenModalUpgradeMessage] = useState(false);

  const isAddressActivity = webhook.type === WEBHOOK_TYPES.ADDRESS_ACTIVITY;

  const _renderContentNotifyOf = () => {
    if (isAddressActivity) {
      return null;
    }

    if (!activity.notifyOf) {
      return <Td>--</Td>;
    }

    const notifyOf = `${formatCapitalize(
      activity.notifyOf.type,
    )}: ${formatCapitalize(activity.notifyOf.name)}`;

    return (
      <Td>
        <Tooltip hasArrow placement="top" label={notifyOf}>
          {notifyOf.length > 30 ? formatShortText(notifyOf, 30, 0) : notifyOf}
        </Tooltip>
      </Td>
    );
  };

  const _renderContentTokenInfo = () => {
    if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      const content = activity?.metadata?.tx?.tokenIds?.join(', ');
      return (
        <Td textAlign="center" w="10%">
          <Tooltip hasArrow placement="top" label={content}>
            <Box overflow={'hidden'} textOverflow={'ellipsis'}>
              {content || '*'}
            </Box>
          </Tooltip>
        </Td>
      );
    }

    if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
      const content = formatTokenData(webhook);
      return (
        <Td textAlign="center" w="15%" isTruncated>
          <Tooltip hasArrow placement="top" label={content}>
            {content}
          </Tooltip>
        </Td>
      );
    }

    return null;
  };

  const onRedirectToBlockExplorer = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    return;
  };

  return (
    <>
      <Tbody>
        <Tr
          className="tr-list"
          onClick={() => {
            history.push(
              `/webhook/${webhook.registrationId}/activities/${activity.hash}`,
            );
          }}
        >
          <Td w={isAddressActivity ? '25%' : '12%'}>
            <Tooltip hasArrow placement="top" label={activity.id}>
              {activity.id.length > 8
                ? formatShortText(activity.id, 4, 4)
                : activity.id}
            </Tooltip>
          </Td>
          {_renderContentNotifyOf()}
          {_renderContentTokenInfo()}
          <Td w={isAddressActivity ? '25%' : '15%'}>
            <Flex alignItems="center" justifyContent="center">
              {formatShortText(activity?.transactionHash)}
              {activity?.transactionHash && (
                <Box ml={2}>
                  <a
                    onClick={(e) => onRedirectToBlockExplorer(e)}
                    href={getExplorerTxUrl(
                      webhook?.chain,
                      webhook?.network,
                      activity?.transactionHash,
                    )}
                    className="link-redirect"
                    target="_blank"
                  >
                    <LinkIcon />
                  </a>
                </Box>
              )}
            </Flex>
          </Td>
          <Td w={isAddressActivity ? '25%' : '20%'}>
            {formatTimestamp(
              activity?.metadata?.tx?.timestamp,
              'YYYY-MM-DD HH:mm:ss',
            )}
          </Td>
          <Td w={isAddressActivity ? '20%' : '10%'} textAlign={'center'}>
            {_renderStatus(activity)}
          </Td>
          <Td w="5%">
            <Flex justifyContent={'flex-end'}>
              <Box className="link-redirect">
                <LinkDetail />
              </Box>
            </Flex>
          </Td>
        </Tr>
      </Tbody>
      <ModalUpgradeMessage
        open={openModalUpgradeMessage}
        onClose={() => setOpenModalUpgradeMessage(false)}
      />
    </>
  );
};

interface IActivityDatatable {
  params?: any;
  isFilter?: boolean;
  hidePagination?: boolean;
  limit: number;
  setParams?: (params: any) => void;
  fetchDataTable: (requestParams: RequestParams) => Promise<any>;
}

const ActivityDatatable: FC<IActivityDatatable> = ({
  hidePagination,
  params,
  setParams,
  limit,
  isFilter,
  fetchDataTable,
}) => {
  const { id: webhookId } = useParams<{ id: string }>();
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const { webhook } = useWebhookDetails(webhookId);

  const isAddressActivity = webhook.type === WEBHOOK_TYPES.ADDRESS_ACTIVITY;

  const _renderHeader = () => {
    if (isMobile) return;

    const _renderHeaderNotifyOf = () => {
      if (isAddressActivity) {
        return null;
      }

      return (
        <Th>
          <Flex alignItems="center">
            NOTIFY OF
            <Tooltip
              placement={'top'}
              hasArrow
              p={2}
              className="tooltip-app"
              label="The function/event of which the message notify you, according to your Notification filter setups"
            >
              <Box className="icon-info" ml={2} cursor={'pointer'} />
            </Tooltip>
          </Flex>
        </Th>
      );
    };

    const _renderHeaderTokenInfo = () => {
      if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
        return (
          <Th textAlign="center" w="10%">
            <Flex alignItems={'center'} justifyContent={'center'}>
              TOKEN ID
              {isFilter && (
                <AppFilter
                  value={params.tokenId}
                  onChange={(tokenId) => {
                    setParams && setParams({ ...params, tokenId });
                  }}
                  type="token ID"
                />
              )}
            </Flex>
          </Th>
        );
      }

      if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
        return (
          <Th textAlign="center" w="15%">
            TOKEN NAME
          </Th>
        );
      }

      return null;
    };

    return (
      <Thead className="header-list">
        <Tr>
          <Th w={isAddressActivity ? '25%' : '12%'}>MESSAGE ID</Th>
          {_renderHeaderNotifyOf()}
          {_renderHeaderTokenInfo()}
          <Th w={isAddressActivity ? '25%' : '15%'}>
            <Flex alignItems={'center'} justifyContent={'center'}>
              TXN ID
              {isFilter && (
                <AppFilter
                  value={params.txHash}
                  onChange={(txHash) => {
                    setParams && setParams({ ...params, txHash });
                  }}
                  type="txn ID"
                />
              )}
            </Flex>
          </Th>
          <Th w={isAddressActivity ? '25%' : '20%'}>CREATED AT (UTC)</Th>
          <Th w={isAddressActivity ? '20%' : '10%'}>
            <Flex alignItems={'center'} justifyContent={'center'}>
              STATUS
              {isFilter && (
                <AppFilter
                  value={params.status}
                  onChange={(status) => {
                    setParams && setParams({ ...params, status });
                  }}
                  type="status"
                  options={optionsFilter}
                />
              )}
            </Flex>
          </Th>
          <Th w="5%" />
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
          onReload={forceUpdate}
        />
      );
    });
  };

  const _renderLoading = () => {
    return <AppLoadingTable widthColumns={getWidthColumns(webhook)} />;
  };

  return (
    <AppDataTable
      hidePagination={hidePagination}
      requestParams={params}
      fetchData={fetchDataTable}
      wrapperClassName="table-fixed"
      renderLoading={_renderLoading}
      renderBody={(data) =>
        isMobile
          ? _renderListActivityMobile(data)
          : _renderListActivityDesktop(data)
      }
      renderHeader={_renderHeader}
      limit={limit}
    />
  );
};

export default ActivityDatatable;
