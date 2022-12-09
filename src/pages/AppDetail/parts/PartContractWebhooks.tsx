import { Box, Flex } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import ListWebhook from './ListWebhook';
import 'src/styles/pages/HomePage.scss';
import { NoData } from 'src/assets/icons';
import { isMobile } from 'react-device-detect';

interface IListContract {
  appInfo: IAppResponse;
}

interface IParams {
  appId?: string;
  type?: string;
}

const PartContractWebhooks: FC<IListContract> = ({ appInfo }) => {
  const history = useHistory();
  const [params, setParams] = useState<IParams>({});
  const [totalWebhook, setTotalWebhook] = useState<any>();
  const isDisabledApp = appInfo.status === APP_STATUS.DISABLED;

  const _renderNoData = () => {
    return (
      <Flex className="box-create">
        <NoData />
        No data yet. Create your first Contract Activity webhook to start
        experiencing Blocklens!
        <AppButton
          isDisabled={isDisabledApp}
          size={'md'}
          onClick={() =>
            history.push(
              `/create-webhook/${appInfo.appId}?type=${WEBHOOK_TYPES.CONTRACT_ACTIVITY}`,
            )
          }
        >
          Create
        </AppButton>
      </Flex>
    );
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mx={isMobile ? 5 :  10}>
        <Box className="description">
          Get notified when your Contract occurs activities
        </Box>
      </Flex>
      <Box mt={3} className="list-table-wrap">
        <ListWebhook
          setTotalWebhook={setTotalWebhook}
          totalWebhook={totalWebhook}
          params={params}
          appInfo={appInfo}
          setParams={setParams}
          type={WEBHOOK_TYPES.CONTRACT_ACTIVITY}
        />
        {totalWebhook === 0 && _renderNoData()}
      </Box>
    </>
  );
};

export default PartContractWebhooks;
