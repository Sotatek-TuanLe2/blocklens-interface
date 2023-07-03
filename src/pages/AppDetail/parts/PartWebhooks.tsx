import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { AppButton } from 'src/components';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { getNameWebhook } from 'src/utils/utils-webhook';
import ListWebhook from './ListWebhook';
import { useHistory } from 'react-router';
import { isMobile } from 'react-device-detect';

interface IListAddress {
  appInfo: IAppResponse;
  type: string;
  description: string;
}

interface IParams {
  appId?: string;
  type?: string;
}

const PartWebhooks: FC<IListAddress> = ({ appInfo, type, description }) => {
  const [params, setParams] = useState<IParams>({});
  const [totalWebhook, setTotalWebhook] = useState<any>();
  const isDisabledApp = appInfo.status === APP_STATUS.DISABLED;
  const history = useHistory();

  const _renderNoData = () => {
    return (
      <Flex className="box-create">
        <Box className="icon-no-data" mb={4} />
        Create your webhook to start experiencing Blocklens with{' '}
        {getNameWebhook(type)}!
        <AppButton
          isDisabled={isDisabledApp}
          size={'lg'}
          onClick={() => {
            history.push(`/create-webhook/${appInfo.appId}?type=${type}`);
          }}
        >
          Create
        </AppButton>
      </Flex>
    );
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mx={isMobile ? 5 : 10}
      >
        <Box className="description">{description}</Box>
      </Flex>

      <Box mt={3} className="list-table-wrap">
        <ListWebhook
          setTotalWebhook={setTotalWebhook}
          totalWebhook={totalWebhook}
          params={params}
          appInfo={appInfo}
          setParams={setParams}
          type={type}
        />
        {totalWebhook === 0 && _renderNoData()}
      </Box>
    </>
  );
};

export default PartWebhooks;
