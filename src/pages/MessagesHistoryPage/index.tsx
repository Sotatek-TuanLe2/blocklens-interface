import { Box, Flex, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
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
  optionsFilter,
  IWebhook,
} from 'src/utils/utils-webhook';
import MessageItem from './parts/MessageItem';
import { toastError } from 'src/utils/utils-notify';
import { FilterIcon } from 'src/assets/icons';
import _ from 'lodash';

const MessagesHistory = () => {
  const { id: hashId } = useParams<{ id: string }>();
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueFilter, setValueFilter] = useState<string>('');
  const [webhook, setWebhook] = useState<IWebhook | any>({});

  const getWebhookInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getMessagesHistory(hashId)) as any;
      setWebhook(res);
    } catch (error: any) {
      setWebhook({});
    }
  }, []);

  useEffect(() => {
    getWebhookInfo().then();
  }, []);

  const fetchDataTable: any = useCallback(async (params: any) => {
    try {
      return await rf
        .getRequest('NotificationRequest')
        .getMessagesHistory(hashId, _.omitBy(params, _.isEmpty));
    } catch (error: any) {
      toastError({
        message: error?.message || 'Oops. Something went wrong!',
      });
    }
  }, []);

  const _renderHeader = () => {
    const _renderHeaderNFT = () => {
      return (
        <>
          <Th>
            <Flex alignItems="center">
              method{' '}
              <Box ml={2} className="filter-table">
                <FilterIcon />
              </Box>
            </Flex>
          </Th>
          <Th textAlign="center">
            <Flex alignItems="center">
              token id
              <Box ml={2} className="filter-table">
                <FilterIcon />
              </Box>
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
            <Box ml={2} className="filter-table">
              <FilterIcon />
            </Box>
          </Flex>
        </Th>
      );
    };

    const _renderHeaderContract = () => {
      return (
        <Th textAlign="center">
          <Flex alignItems="center">
            method
            <Box ml={2} className="filter-table">
              <FilterIcon />
            </Box>
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
          <Th>
            <Flex alignItems="center">
              txn id
              <Box ml={2} className="filter-table">
                <FilterIcon />
              </Box>
            </Flex>
          </Th>
          {_renderHeaderActivities()}
          <Th>Status</Th>
          <Th />
        </Tr>
      </Thead>
    );
  };

  const _renderBody = (data?: any[]) => {
    return data?.map((message: any, index: number) => {
      return <MessageItem message={message} key={index} webhook={webhook} />;
    });
  };

  const _renderBoxFilter = () => {
    return (
      <Flex className="box-filter">
        <Box width={'150px'}>
          <AppSelect2
            onChange={setValueFilter}
            options={optionsFilter}
            value={valueFilter}
          />
        </Box>
        <Box width={'200px'}>
          <AppInput
            isSearch
            className={'input-search'}
            type="text"
            placeholder={'Search...'}
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value.trim())}
          />
        </Box>
      </Flex>
    );
  };
  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <AppLink to={`/`}>
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
