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

// const onRetry = async (
//   e: MouseEvent<SVGSVGElement | HTMLButtonElement>,
//   activity: IActivityResponse,
//   webhook: IWebhook,
//   onReload: () => void,
// ) => {
//   e.stopPropagation();
//   if (webhook.status === WEBHOOK_STATUS.DISABLED) return;
//   await rf.getRequest('NotificationRequest').retryActivity(activity.hash);
//   toastSuccess({ message: 'Retried!' });
//   onReload();
// };

// const handlerRetryError = (error: any, handleLimitError: any) => {
//   if (getErrorMessage(error) === 'Limit of daily messages is reached') {
//     handleLimitError();
//   } else console.error(error);
// };

const ActivityMobile: FC<IActivity> = ({ activity, webhook }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openModalUpgradeMessage, setOpenUpgradeMessage] = useState(false);

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
              {/*{activity?.lastStatus !== STATUS.DONE && (*/}
              {/*  <Box width={'48%'}>*/}
              {/*    <AppButton*/}
              {/*      variant="cancel"*/}
              {/*      size="sm"*/}
              {/*      onClick={async (e) => {*/}
              {/*        try {*/}
              {/*          await onRetry(e, activity, webhook, onReload);*/}
              {/*        } catch (error) {*/}
              {/*          handlerRetryError(error, () =>*/}
              {/*            setOpenUpgradeMessage(true),*/}
              {/*          );*/}
              {/*        }*/}
              {/*      }}*/}
              {/*      w={'100%'}*/}
              {/*      isDisabled={webhook.status === WEBHOOK_STATUS.DISABLED}*/}
              {/*    >*/}
              {/*      Retry Now*/}
              {/*    </AppButton>*/}
              {/*  </Box>*/}
              {/*)}*/}

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

  const _renderContentContract = () => {
    return <Td w="15%">{activity?.metadata?.method || '--'}</Td>;
  };

  const _renderContentNFT = () => {
    const content = activity?.metadata?.tx?.tokenIds?.join(', ');
    return (
      <>
        <Td w="13%">{activity?.metadata?.method || '--'}</Td>
        <Td textAlign="center" w="10%">
          <Tooltip hasArrow placement="top" label={content}>
            <Box overflow={'hidden'} textOverflow={'ellipsis'}>
              {content || '*'}
            </Box>
          </Tooltip>
        </Td>
      </>
    );
  };

  const _renderContentAddress = () => {
    return (
      <Td w="15%">{formatShortText(activity?.metadata?.trackingAddress)}</Td>
    );
  };

  const _renderContentAptosCoin = () => {
    return (
      <Td w="15%" isTruncated>
        <Tooltip
          hasArrow
          placement="top"
          label={webhook?.metadata?.coinType || ''}
        >
          {shortAddressType(webhook?.metadata?.coinType || '')}
        </Tooltip>
      </Td>
    );
  };

  const _renderContentAptosToken = () => {
    const content = formatTokenData(webhook);

    return (
      <Td w="15%" isTruncated>
        <Tooltip hasArrow placement="top" label={content}>
          {content}
        </Tooltip>
      </Td>
    );
  };

  const _renderContentActivities = () => {
    if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderContentNFT();
    }

    if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderContentContract();
    }

    if (webhook.type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
      return _renderContentAptosCoin();
    }

    if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
      return _renderContentAptosToken();
    }

    return _renderContentAddress();
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
          <Td w="25%">
            {formatTimestamp(activity.createdAt * 1000, 'YYYY-MM-DD HH:mm:ss')}{' '}
            UTC
          </Td>
          <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '12%' : '15%'}>
            {activity?.metadata?.tx?.block || '--'}
          </Td>
          <Td w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '15%' : '20%'}>
            <Flex alignItems="center">
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
          {_renderContentActivities()}
          <Td w="15%" textAlign={'center'}>
            {_renderStatus(activity)}
          </Td>
          <Td w="15%">
            <Flex justifyContent={'flex-end'}>
              {/*{activity?.lastStatus !== STATUS.DONE && (*/}
              {/*  <Box*/}
              {/*    className="link-redirect"*/}
              {/*    mr={3}*/}
              {/*    cursor={*/}
              {/*      webhook.status === WEBHOOK_STATUS.DISABLED*/}
              {/*        ? 'not-allowed'*/}
              {/*        : 'pointer'*/}
              {/*    }*/}
              {/*  >*/}
              {/*    <RetryIcon*/}
              {/*      onClick={async (e) => {*/}
              {/*        try {*/}
              {/*          await onRetry(e, activity, webhook, onReload);*/}
              {/*        } catch (error) {*/}
              {/*          handlerRetryError(error, () =>*/}
              {/*            setOpenModalUpgradeMessage(true),*/}
              {/*          );*/}
              {/*        }*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*)}*/}

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
            {isFilter && (
              <AppFilter
                value={params?.method}
                onChange={(method) => {
                  setParams && setParams({ ...params, method });
                }}
                type="method"
              />
            )}
          </Flex>
        </Th>
      );
    };

    const _renderHeaderAptosCoin = () => {
      return (
        <Th textAlign="center" w={'15%'}>
          <Flex alignItems="center">Coin Type</Flex>
        </Th>
      );
    };

    const _renderHeaderAptosToken = () => {
      return (
        <Th textAlign="center" w={'15%'}>
          <Flex alignItems="center">Token Data</Flex>
        </Th>
      );
    };

    const _renderHeaderAddress = () => {
      return (
        <Th w="15%">
          <Flex alignItems="center">
            Address
            {isFilter && (
              <AppFilter
                value={params.address}
                onChange={(address) => {
                  setParams && setParams({ ...params, address });
                }}
                type="address"
              />
            )}
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

      if (webhook.type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
        return _renderHeaderAptosCoin();
      }

      if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
        return _renderHeaderAptosToken();
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
          <Th w={'15%'}>
            <Flex alignItems="center">
              txn id
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
          {_renderHeaderActivities()}
          <Th w="15%">
            <Flex alignItems={'center'} justifyContent={'center'}>
              Status
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
              {/* <Tooltip
                p={2}
                label="Messages for each activity will retry 5 times if send failed, each auto-retry occurs after one minute.
                 The status shows Failed if all retries failed or user’s daily limit is reached."
                placement={'top'}
                hasArrow
                className={'tooltip-app'}
              >
                <Box ml={2} cursor="pointer">
                  <InfoIcon />
                </Box>
              </Tooltip> */}
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
