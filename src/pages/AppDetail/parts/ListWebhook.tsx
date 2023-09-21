import React, { useCallback, useEffect, FC, useState } from 'react';
import { IListAppResponse } from 'src/utils/common';
import rf from 'src/requests/RequestFactory';
import {
  IWebhook,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
  formatTokenData,
} from 'src/utils/utils-webhook';
import { Th, Thead, Tr, Tbody, Td, Box, Flex, Tooltip } from '@chakra-ui/react';
import { AppDataTable, AppLoadingTable } from 'src/components';
import { formatShortText, shortAddressType } from 'src/utils/utils-helper';
import _ from 'lodash';
import { IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';
import { formatNumber } from 'src/utils/utils-format';

interface IListWebhook {
  appInfo: IAppResponse;
  setParams: (value: any) => void;
  params: any;
  setTotalWebhook: (value: number) => void;
  totalWebhook: number;
  type?: string;
}

interface IWebhookItem {
  webhook: IWebhook;
}

const _renderStatus = (status?: WEBHOOK_STATUS) => {
  const isActive = status === WEBHOOK_STATUS.ENABLE;

  return (
    <Box className={`status ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </Box>
  );
};

// const _renderDetailWebhook = (type: string, webhook: IWebhook) => {
//   if (type === WEBHOOK_TYPES.ADDRESS_ACTIVITY) {
//     return (
//       <>
//         {webhook.metadata.addresses.length}{' '}
//         {webhook.metadata.addresses.length > 1 ? 'addresses' : 'address'}
//       </>
//     );
//   }

//   if (type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
//     return (
//       <Box>
//         <Tooltip hasArrow placement="top" label={webhook?.metadata?.coinType}>
//           <Box overflow={'hidden'} textOverflow={'ellipsis'}>
//             {shortAddressType(webhook?.metadata?.coinType || '')}
//           </Box>
//         </Tooltip>
//       </Box>
//     );
//   }

//   if (type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
//     const content = formatTokenData(webhook);
//     return (
//       <Box>
//         <Tooltip hasArrow placement="top" label={content}>
//           <Box overflow={'hidden'} textOverflow={'ellipsis'}>
//             {content}
//           </Box>
//         </Tooltip>
//       </Box>
//     );
//   }

//   return (
//     <Box overflow={'hidden'} textOverflow={'ellipsis'}>
//       {formatShortText(webhook?.metadata?.address)}
//     </Box>
//   );
// };

// const _renderTitleField = (type?: string) => {
//   if (type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
//     return 'Coin Type';
//   }

//   if (type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
//     return 'Token Data';
//   }

//   return 'Address';
// };

const WebhookMobile: FC<IWebhookItem> = ({ webhook }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Box
        className={`${isOpen ? 'open' : ''} card-mobile`}
        onClick={() => history.push(`/webhooks/${webhook.registrationId}`)}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box className="name-mobile">{webhook.webhookName}</Box>
          <Box
            className={isOpen ? 'icon-minus' : 'icon-plus'}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Id</Box>
          <Box>{webhook.registrationId}</Box>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box>Status</Box>
          <Box>{_renderStatus(webhook.status)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Webhook URL</Box>
              <Box className="short-text value" ml={3}>
                {webhook.webhook}
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>MSG (IN 24H)</Box>
              <Box className="value">{formatNumber(webhook.messageToday)}</Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const WebhookItem: FC<IWebhookItem> = ({ webhook }) => {
  const history = useHistory();
  return (
    <Tbody>
      <Tr
        className="tr-list"
        onClick={() => history.push(`/webhooks/${webhook.registrationId}`)}
      >
        <Td w="25%" isTruncated>
          <Tooltip hasArrow placement="top" label={webhook.webhookName}>
            {webhook.webhookName}
          </Tooltip>
        </Td>
        <Td w="20%" isTruncated>
          <Tooltip hasArrow placement="top" label={webhook.registrationId}>
            {formatShortText(webhook.registrationId)}
          </Tooltip>
        </Td>
        <Td w="25%" isTruncated>
          <Tooltip hasArrow placement="top" label={webhook.webhook}>
            {webhook.webhook}
          </Tooltip>
        </Td>
        <Td>{formatNumber(webhook.messageToday)}</Td>
        <Td textAlign={'right'}>{_renderStatus(webhook.status)}</Td>
      </Tr>
    </Tbody>
  );
};

const ListWebhook: FC<IListWebhook> = ({
  appInfo,
  setParams,
  params,
  setTotalWebhook,
  totalWebhook,
  type,
}) => {
  const fetchListWebhook: any = useCallback(
    async (params: any) => {
      try {
        const res: IListAppResponse = await rf
          .getRequest('RegistrationRequest')
          .getRegistrations(appInfo.projectId, params);

        if (!!res.docs.length) {
          const res24h = await rf
            .getRequest('NotificationRequest')
            .getWebhookStats24h(res.docs.map((item) => item.registrationId));

          if (!!res24h.length) {
            res.docs.forEach((item) => {
              const itemInRes24h = res24h.find(
                (item24h: any) =>
                  item24h.registrationId === item.registrationId,
              );
              if (itemInRes24h) {
                item.messageToday = itemInRes24h.message;
              }
            });
          }
        }

        setTotalWebhook(res?.totalDocs || 0);
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    [appInfo.projectId, params],
  );

  useEffect(() => {
    setParams(
      _.omitBy(
        {
          ...params,
          type,
        },
        _.isEmpty,
      ),
    );
  }, [appInfo]);

  const _renderLoading = () => {
    const widthColumns = [20, 35, 30, 15];
    return <AppLoadingTable widthColumns={widthColumns} />;
  };

  const _renderHeader = () => {
    if (isMobile) return;

    return (
      <Thead className="header-list">
        <Tr>
          <Th w="25%">NAME</Th>
          <Th w="20%">ID</Th>
          <Th w="25%">WEBHOOK URL</Th>
          <Th>MSG (IN 24H)</Th>
          <Th textAlign={'right'}>STATUS</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderListWebhookMobile = (webhooks?: IWebhook[]) => {
    return (
      <Box className="list-card-mobile">
        {webhooks?.map((webhook: IWebhook, index: number) => {
          return <WebhookMobile key={index} webhook={webhook} />;
        })}
      </Box>
    );
  };

  const _renderBody = (webhooks?: IWebhook[]) => {
    if (isMobile) return _renderListWebhookMobile(webhooks);
    return webhooks?.map((webhook: IWebhook, index: number) => {
      return <WebhookItem key={index} webhook={webhook} />;
    });
  };

  return (
    <AppDataTable
      requestParams={params}
      fetchData={fetchListWebhook}
      renderBody={_renderBody}
      renderLoading={_renderLoading}
      wrapperClassName="table-fixed"
      isNotShowNoData
      renderHeader={totalWebhook > 0 ? _renderHeader : undefined}
      limit={10}
    />
  );
};

export default ListWebhook;
