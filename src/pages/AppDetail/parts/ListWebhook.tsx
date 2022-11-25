import React, { useCallback, useEffect, FC, useState } from 'react';
import { IListAppResponse } from 'src/utils/common';
import rf from 'src/requests/RequestFactory';
import {
  IWebhook,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { Th, Thead, Tr, Tbody, Td, Box } from '@chakra-ui/react';
import { AppDataTable } from 'src/components';
import { formatShortText } from 'src/utils/utils-helper';
import _ from 'lodash';
import { IAppResponse } from 'src/utils/utils-app';
import { useHistory } from 'react-router';

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

const WebhookItem: FC<IWebhookItem> = ({ webhook, appInfo, type }) => {
  const history = useHistory();

  const _renderStatus = (status?: WEBHOOK_STATUS) => {
    const isActive = status === WEBHOOK_STATUS.ENABLE;

    return (
      <Box className={`status ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </Box>
    );
  };

  return (
    <Tbody>
      <Tr
        className="tr-list"
        onClick={() =>
          history.push(
            `/apps/${appInfo.appId}/webhooks/${webhook.registrationId}`,
          )
        }
      >
        <Td>{formatShortText(webhook.registrationId)}</Td>
        <Td>
          <Box className="short-text">{webhook.webhook}</Box>
        </Td>
        <Td>
          {type === WEBHOOK_TYPES.ADDRESS_ACTIVITY ? (
            <>
              {webhook.metadata.addresses.length}{' '}
              {webhook.metadata.addresses.length > 1 ? 'addresses' : 'address'}
            </>
          ) : (
            '1 address'
          )}
        </Td>
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
    return (
      <Thead className="header-list">
        <Tr>
          <Th>ID</Th>
          <Th>Webhook URL</Th>
          <Th>Address</Th>
          <Th textAlign={'right'}>Status</Th>
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (webhooks?: IWebhook[]) => {
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
