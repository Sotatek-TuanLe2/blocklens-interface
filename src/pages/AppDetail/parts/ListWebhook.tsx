import React, { useCallback, useEffect, FC, useState } from 'react';
import { IListAppResponse } from 'src/utils/common';
import rf from 'src/requests/RequestFactory';
import {
  IWebhook,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { Th, Thead, Tr, Tbody, Td, Box, Flex } from '@chakra-ui/react';
import { AppDataTable } from 'src/components';
import { formatShortText } from 'src/utils/utils-helper';
import _ from 'lodash';
import { IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';

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
  appInfo: IAppResponse;
  type: string;
}

const _renderStatus = (status?: WEBHOOK_STATUS) => {
  const isActive = status === WEBHOOK_STATUS.ENABLE;

  return (
    <Box className={`status ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? 'Active' : 'Inactive'}
    </Box>
  );
};

const WebhookMobile: FC<IWebhookItem> = ({ webhook, appInfo, type }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Box className={`${isOpen ? 'open' : ''} card-mobile`}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          className="info"
        >
          <Box
            className="name-mobile"
            onClick={() =>
              history.push(
                `/app/${appInfo.appId}/webhooks/${webhook.registrationId}`,
              )
            }
          >
            {formatShortText(webhook.registrationId)}
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
          <Box>{_renderStatus(webhook.status)}</Box>
        </Flex>

        {isOpen && (
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Webhook</Box>
              <Box className="short-text value" ml={3}>
                {webhook.webhook}
              </Box>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="info"
            >
              <Box>Address</Box>
              <Box className="value">
                {type === WEBHOOK_TYPES.ADDRESS_ACTIVITY ? (
                  <>
                    {webhook.metadata.addresses.length}{' '}
                    {webhook.metadata.addresses.length > 1
                      ? 'addresses'
                      : 'address'}
                  </>
                ) : (
                  '1 address'
                )}
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
    </>
  );
};

const WebhookItem: FC<IWebhookItem> = ({ webhook, appInfo, type }) => {
  const history = useHistory();
  return (
    <Tbody>
      <Tr
        className="tr-list"
        onClick={() =>
          history.push(
            `/app/${appInfo.appId}/webhooks/${webhook.registrationId}`,
          )
        }
      >
        <Td w="20%">{formatShortText(webhook.registrationId)}</Td>
        <Td w="45%">
          <Box className="short-text">{webhook.webhook}</Box>
        </Td>
        <Td w="20%">
          {type === WEBHOOK_TYPES.ADDRESS_ACTIVITY ? (
            <>
              {webhook.metadata.addresses.length}{' '}
              {webhook.metadata.addresses.length > 1 ? 'addresses' : 'address'}
            </>
          ) : (
            '1 address'
          )}
        </Td>
        <Td w="15%" textAlign={'right'}>
          {_renderStatus(webhook.status)}
        </Td>
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
          .getRegistrations(appInfo.appId, params);
        setTotalWebhook(res.totalDocs);
        return res;
      } catch (error) {
        return error;
      }
    },
    [appInfo.appId, params],
  );

  useEffect(() => {
    setParams(
      _.omitBy(
        {
          ...params,
          type,
          appId: appInfo.appId,
        },
        _.isEmpty,
      ),
    );
  }, [appInfo]);

  const _renderHeader = () => {
    if (isMobile) return;
    return (
      <Thead className="header-list">
        <Tr>
          <Th w="20%">ID</Th>
          <Th w="45%">Webhook URL</Th>
          <Th w="20%">Address</Th>
          <Th textAlign={'right'} w="15%">
            Status
          </Th>
        </Tr>
      </Thead>
    );
  };

  const _renderListWebhookMobile = (webhooks?: IWebhook[]) => {
    return (
      <Box className="list-card-mobile">
        {webhooks?.map((webhook: IWebhook, index: number) => {
          return (
            <WebhookMobile
              appInfo={appInfo}
              key={index}
              webhook={webhook}
              type={webhook.type}
            />
          );
        })}
      </Box>
    );
  };

  const _renderBody = (webhooks?: IWebhook[]) => {
    if (isMobile) return _renderListWebhookMobile(webhooks);
    return webhooks?.map((webhook: IWebhook, index: number) => {
      return (
        <WebhookItem
          key={index}
          webhook={webhook}
          appInfo={appInfo}
          type={webhook.type}
        />
      );
    });
  };

  return (
    <AppDataTable
      requestParams={params}
      fetchData={fetchListWebhook}
      renderBody={_renderBody}
      isNotShowNoData
      renderHeader={totalWebhook > 0 ? _renderHeader : undefined}
      limit={10}
    />
  );
};

export default ListWebhook;
