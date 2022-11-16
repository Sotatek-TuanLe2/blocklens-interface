import { Box, Flex } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useState } from 'react';
import { AppButton, AppCard } from 'src/components';
import { useHistory } from 'react-router';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import ListWebhook from './ListWebhook';

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
      <Flex alignItems={'center'} my={10} flexDirection={'column'}>
        Set up your first contract activity webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          cursor={isDisabledApp ? 'not-allowed' : 'pointer'}
          onClick={() => {
            if (isDisabledApp) return;
            history.push(`/create-webhook-contract/${appInfo.appId}`)
          }}
        >
          + Create webhook
        </Box>
      </Flex>
    );
  };

  return (
    <>
      <AppCard mt={10} className="list-nft" p={0}>
        <Flex justifyContent="space-between" py={5} px={8} alignItems="center">
          <Flex alignItems="center">
            <Box className="icon-app-nft" mr={4} />
            <Box className="name">
              Contract Notifications
              <Box className="description">
                Get notified when YOUR Contract occurs activities
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            fontWeight={'400'}
            size={'md'}
            isDisabled={isDisabledApp}
            onClick={() =>
              history.push(`/create-webhook-contract/${appInfo.appId}`)
            }
          >
            <SmallAddIcon mr={1} /> Create webhook
          </AppButton>
        </Flex>

        <Box bgColor={'#FAFAFA'} borderBottomRadius={'10px'} pb={8}>
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
      </AppCard>
    </>
  );
};

export default PartContractWebhooks;
