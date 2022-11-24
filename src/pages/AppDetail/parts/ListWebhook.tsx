import React, { useCallback, useEffect, FC, useState } from 'react';
import { IListAppResponse } from 'src/utils/common';
import rf from 'src/requests/RequestFactory';
import {
  IWebhook,
  WEBHOOK_STATUS,
  WEBHOOK_TYPES,
} from 'src/utils/utils-webhook';
import { Th, Thead, Tr, Tbody, Td, Flex, Box } from '@chakra-ui/react';
import {
  AppDataTable,
  AppField,
  AppInput,
  AppUploadABI,
} from 'src/components';
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
  isDetail?: boolean;
}

interface IWebhookItem {
  webhook: IWebhook;
  appInfo: IAppResponse;
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
  const history = useHistory();
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
