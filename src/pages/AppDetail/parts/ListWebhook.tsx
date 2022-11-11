import React, { useCallback, useEffect, FC, useState } from 'react';
import { IListAppResponse } from 'src/utils/common';
import rf from 'src/requests/RequestFactory';
import { IWebhook, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import { Th, Thead, Tr, Tbody, Td, Flex } from '@chakra-ui/react';
import {
  AppDataTable,
  AppField,
  AppInput,
  AppLink,
  AppUploadABI,
} from 'src/components';
import { formatShortText } from 'src/utils/utils-helper';
import ListActionWebhook from './ListActionWebhook';
import { StatusWebhook } from './PartAddressWebhooks';
import _ from 'lodash';

interface IListWebhook {
  appInfo: any;
  setParams: (value: any) => void;
  params: any;
  setTotalWebhook: (value: number) => void;
  totalWebhook: number;
  type?: string;
  isDetail?: boolean;
}

interface IWebhookItem {
  webhook: IWebhook;
  appInfo: any;
  setParams: (value: any) => void;
  type: string;
  isDetail?: boolean;
}

const WebhookItem: FC<IWebhookItem> = ({
  webhook,
  appInfo,
  setParams,
  type,
  isDetail,
}) => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

  useEffect(() => {
    if (isDetail) {
      setIsShowDetail(true);
    }
  }, [isDetail]);

  const _renderDetailAddressWebhook = () => {
    return (
      <>
        {webhook.metadata.addresses.map((item: string, index: number) => {
          return (
            <AppField
              label={`${appInfo.chain} ADDRESS`}
              customWidth={'100%'}
              key={index}
              isRequired
            >
              <AppInput
                placeholder="0xbb.."
                size="lg"
                value={item}
                isDisabled
              />
            </AppField>
          );
        })}
      </>
    );
  };

  const _renderDetailNFTWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'NFT ADDRESS'} customWidth={'49%'} isRequired>
          <AppInput
            placeholder="0xbb.."
            value={webhook.metadata.address}
            isDisabled
          />
        </AppField>
        <AppField label={'TOKEN IDS'} customWidth={'49%'} isRequired>
          <AppInput
            placeholder="0xbb.."
            value={webhook.metadata.tokenIds.join(', ')}
            isDisabled
          />
        </AppField>

        <AppUploadABI
          viewOnly
          abi={webhook.metadata.abi}
          abiFilter={webhook.metadata.abiFilter}
        />
      </Flex>
    );
  };

  const _renderDetailContractWebhook = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'CONTRACT ADDRESS'} customWidth={'100%'} isRequired>
          <AppInput
            placeholder="0xbb.."
            value={webhook.metadata.address}
            isDisabled
          />
        </AppField>
        <AppUploadABI
          viewOnly
          abi={webhook.metadata.abi}
          abiFilter={webhook.metadata.abiFilter}
        />
      </Flex>
    );
  };

  const _renderDetailWebhook = () => {
    switch (type) {
      case WEBHOOK_TYPES.NFT_ACTIVITY:
        return _renderDetailNFTWebhook();
      case WEBHOOK_TYPES.ADDRESS_ACTIVITY:
        return _renderDetailAddressWebhook();
      case WEBHOOK_TYPES.CONTRACT_ACTIVITY:
        return _renderDetailContractWebhook();
    }
  };

  return (
    <Tbody>
      <Tr>
        <Td>{formatShortText(webhook.registrationId)}</Td>
        <Td>
          <StatusWebhook status={webhook.status} />
        </Td>
        <Td>
          <a href={webhook.webhook} target="_blank" className="short-text">
            {webhook.webhook}
          </a>
        </Td>
        <Td
          onClick={() => setIsShowDetail(!isShowDetail)}
          color={'brand.500'}
          cursor={'pointer'}
        >
          {type === WEBHOOK_TYPES.ADDRESS_ACTIVITY ? (
            <>
              {webhook.metadata.addresses.length}{' '}
              {webhook.metadata.addresses.length > 1 ? 'Addresses' : 'Address'}
            </>
          ) : (
            '1 Address'
          )}
        </Td>
        <Td>
          {!isDetail && (
            <AppLink
              to={`/apps/${appInfo.appId}/webhooks/${webhook.registrationId}`}
            >
              View details
            </AppLink>
          )}

          <ListActionWebhook
            webhook={webhook}
            reloadData={() =>
              setParams((pre: any) => {
                return { ...pre };
              })
            }
          />
        </Td>
      </Tr>
      {isShowDetail && (
        <Tr>
          <Td colSpan={6} bg={'#FAFAFA'}>
            {_renderDetailWebhook()}
          </Td>
        </Tr>
      )}
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
  isDetail,
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

  const fetchDetail: any = useCallback(
    async (params: any) => {
      try {
        const res: IListAppResponse = await rf
          .getRequest('RegistrationRequest')
          .getRegistration(appInfo.appId, params);
        setTotalWebhook(Object.keys(res).length);
        return {
          docs: [res],
          page: 1,
          totalPages: 1,
        };
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
      <Thead>
        <Tr bgColor={'#FAFAFA'}>
          <Th>ID</Th>
          <Th>Status</Th>
          <Th>Webhook URL</Th>
          <Th>Address</Th>
          <Th>Activities</Th>
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
          setParams={setParams}
          type={webhook.type}
          isDetail={isDetail}
        />
      );
    });
  };

  return (
    <AppDataTable
      requestParams={params}
      fetchData={isDetail ? fetchDetail : fetchListWebhook}
      renderBody={_renderBody}
      isNotShowNoData
      renderHeader={totalWebhook > 0 ? _renderHeader : undefined}
      limit={10}
    />
  );
};

export default ListWebhook;
