import { Box, Flex, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePage } from 'src/layouts';
import {
  AppCard,
  AppDataTable,
  AppInput,
  AppFilter,
  AppLoadingTable,
} from 'src/components';
import {
  WEBHOOK_TYPES,
  optionsFilterMessage,
  IMessages,
} from 'src/utils/utils-webhook';
import MessageItem from './parts/MessageItem';
import { isMobile } from 'react-device-detect';
import MessagesItemMobile from './parts/MessagesItemMobile';
import { filterParams } from 'src/utils/utils-helper';
import ModalFilterActivities from 'src/modals/ModalFilterActivities';
import useWebhookDetails from 'src/hooks/useWebhook';
import { getLogoChainByChainId } from 'src/utils/utils-network';
import { getWidthColumns } from 'src/components/ActivityDatatable';

const MessagesHistory = () => {
  const { id: hashId, webhookId } = useParams<{
    webhookId: string;
    id: string;
  }>();
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);

  const { webhook } = useWebhookDetails(webhookId);
  const history = useHistory();

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf
        .getRequest('NotificationRequest')
        .getMessagesHistory(hashId, filterParams(params));
    } catch (error) {
      console.error(error);
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
              <AppFilter value={method} onChange={setMethod} type="method" />
            </Flex>
          </Th>
          <Th textAlign="center" w="13%">
            <Flex alignItems="center" justifyContent="center">
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

    const _renderHeaderContract = () => {
      return (
        <Th textAlign="center" w="15%">
          <Flex alignItems="center">
            method
            <AppFilter value={method} onChange={setMethod} type="method" />
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

    const _renderHeaderActivities = () => {
      if (webhook.type === WEBHOOK_TYPES.NFT_ACTIVITY) {
        return _renderHeaderNFT();
      }

      if (webhook.type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
        return _renderHeaderContract();
      }

      if (webhook.type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
        return _renderHeaderAptosToken();
      }

      if (webhook.type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
        return _renderHeaderAptosCoin();
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
          <Th w="12%">
            <Flex alignItems="center">
              Status
              <AppFilter
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
          {data?.map((message: IMessages, index: number) => {
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
      <BasePage className="app-detail">
        <Flex justifyContent="center">Webhook Not Found</Flex>
      </BasePage>
    );
  }

  const _renderLoading = () => {
    return <AppLoadingTable widthColumns={getWidthColumns(webhook)} />;
  };

  return (
    <BasePage className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <Box
              className="icon-arrow-left"
              cursor={'pointer'}
              mr={3}
              onClick={() => history.goBack()}
            />
            <Box className="title-mobile">Messages History</Box>
          </Flex>

          {!isMobile && (
            <Flex alignItems={'center'} className="box-network">
              <Box className={getLogoChainByChainId(webhook?.chain)} mr={2} />
              <Box textTransform="capitalize">
                {webhook?.network?.toLowerCase()}
              </Box>
            </Flex>
          )}
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
            wrapperClassName="table-fixed"
            fetchData={fetchDataTable}
            renderBody={_renderBody}
            renderLoading={_renderLoading}
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
    </BasePage>
  );
};

export default MessagesHistory;
