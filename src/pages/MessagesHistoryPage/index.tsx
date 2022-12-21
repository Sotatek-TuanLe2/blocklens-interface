import { Box, Flex, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import {
  AppCard,
  AppDataTable,
  AppInput,
  AppLink,
  AppSelect2,
} from 'src/components';
import {
  WEBHOOK_TYPES,
  optionsFilterMessage,
  IWebhook,
  IMessages,
} from 'src/utils/utils-webhook';
import MessageItem from './parts/MessageItem';
import { toastError } from 'src/utils/utils-notify';
import { isMobile } from 'react-device-detect';
import MessagesItemMobile from './parts/MessagesItemMobile';
import { filterParams } from 'src/utils/utils-helper';
import { Filter } from 'src/pages/WebhookDetail/parts/WebhookActivities';

const MessagesHistory = () => {
  const {
    id: hashId,
    webhookId,
    appId,
  } = useParams<{
    webhookId: string;
    id: string;
    appId: string;
  }>();
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueFilter, setValueFilter] = useState<string>('');
  const [webhook, setWebhook] = useState<IWebhook | any>({});

  const getWebhookInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('RegistrationRequest')
        .getRegistration(appId, webhookId)) as any;
      setWebhook(res);
    } catch (error: any) {
      setWebhook({});
    }
  }, [webhookId]);

  useEffect(() => {
    getWebhookInfo().then();
  }, []);

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf
        .getRequest('NotificationRequest')
        .getMessagesHistory(hashId, filterParams(params));
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
              method <Filter />
            </Flex>
          </Th>
          <Th textAlign="center">
            <Flex alignItems="center">
              token id
              <Filter />
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
            <Filter />
          </Flex>
        </Th>
      );
    };

    const _renderHeaderContract = () => {
      return (
        <Th textAlign="center">
          <Flex alignItems="center">
            method
            <Filter />
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
              txn id
              <Filter />
            </Flex>
          </Th>
          {_renderHeaderActivities()}
          <Th>Status</Th>
          <Th />
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: IMessages[]) => {
    if (isMobile) {
      return (
        <Box className="list-card-mobile">
          {data?.map((message: any, index: number) => {
            return (
              <MessagesItemMobile
                message={message}
                key={index}
                webhook={webhook}
              />
            );
          })}
        </Box>
      );
    }

    return data?.map((message: IMessages, index: number) => {
      return <MessageItem message={message} key={index} webhook={webhook} />;
    });
  };

  const _renderBoxFilter = () => {
    return (
      <Flex className="box-filter activities-all">
        {!isMobile && (
          <Box width={'150px'}>
            <AppSelect2
              onChange={setValueFilter}
              options={optionsFilterMessage}
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

  if (!webhook && !Object.keys(webhook).length) {
    return (
      <BasePageContainer className="app-detail">
        <Flex justifyContent="center">Webhook Not Found</Flex>
      </BasePageContainer>
    );
  }

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <AppLink to={`/app/${appId}/webhooks/${webhookId}`}>
              <Box className="icon-arrow-left" mr={6} />
            </AppLink>
            <Box>Messages History</Box>
          </Flex>
        </Flex>

        <AppCard className="list-table-wrap">
          {_renderBoxFilter()}
          <AppDataTable
            requestParams={{
              status: valueFilter,
              search: valueSearch,
            }}
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderHeader={_renderHeader}
            limit={15}
          />
        </AppCard>
      </>
    </BasePageContainer>
  );
};

export default MessagesHistory;
