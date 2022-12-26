import { Box, Flex, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { AppCard, AppDataTable, AppInput, AppLink } from 'src/components';
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
import ModalFilterActivities from 'src/modals/ModalFilterActivities';

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
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [webhook, setWebhook] = useState<IWebhook | any>({});
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);

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
          <Th w="13%">
            <Flex alignItems="center">
              method{' '}
              <Filter value={method} onChange={setMethod} type="method" />
            </Flex>
          </Th>
          <Th textAlign="center" w="10%">
            <Flex alignItems="center" justifyContent='center'>
              token id
              <Filter value={tokenId} onChange={setTokenId} type="token ID" />
            </Flex>
          </Th>
        </>
      );
    };

    const _renderHeaderAddress = () => {
      return (
        <Th w="20%">
          <Flex alignItems="center">
            Address
            <Filter value={address} onChange={setAddress} type="address" />
          </Flex>
        </Th>
      );
    };

    const _renderHeaderContract = () => {
      return (
        <Th textAlign="center" w="20%">
          <Flex alignItems="center">
            method
            <Filter value={method} onChange={setMethod} type="method" />
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
          <Th w="25%">Created At</Th>
          <Th w={webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY ? '12%' : '15%'}>Block</Th>
          <Th w="15%">
            <Flex alignItems="center">
              txn id
              <Filter value={txHash} onChange={setTxHash} type="txn ID" />
            </Flex>
          </Th>
          {_renderHeaderActivities()}
          <Th w="15%">
            <Flex alignItems="center">
              Status
              <Filter
                value={status}
                onChange={setStatus}
                type="status"
                options={optionsFilterMessage}
              />
            </Flex>
          </Th>
          <Th w="10%" />
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
    if (!isMobile) return <Box p={5} />;
    return (
      <Flex className="box-filter activities-all">
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
            <Box className={'title-mobile'}>Messages History</Box>
          </Flex>
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
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderHeader={_renderHeader}
            limit={15}
          />
        </AppCard>

        {isOpenFilterModal && (
          <ModalFilterActivities
            open={isOpenFilterModal}
            value={status}
            onClose={() => setIsOpenFilterModal(false)}
            onChange={setStatus}
            options={optionsFilterMessage}
          />
        )}
      </>
    </BasePageContainer>
  );
};

export default MessagesHistory;
