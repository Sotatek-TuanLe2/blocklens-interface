import { Flex, Box } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import ListWebhook from './ListWebhook';

interface IListNTF {
  appInfo: IAppResponse;
}

interface IParams {
  appId?: string;
  type?: string;
}

const PartNFTWebhooks: FC<IListNTF> = ({ appInfo }) => {
  const [params, setParams] = useState<IParams>({});
  const history = useHistory();
  const [totalWebhook, setTotalWebhook] = useState<any>();
  const isDisabledApp = appInfo.status === APP_STATUS.DISABLED;

  const _renderNoData = () => {
    return (
      <Flex className="box-create">
        Set up your first NFT activity webhook!
        <AppButton
          isDisabled={isDisabledApp}
          size={'md'}
          onClick={() => history.push(`/create-webhook-nft/${appInfo.appId}`)}
        >
          Create Webhook
        </AppButton>
      </Flex>
    );
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mx={10}>
        <Box className="description">
          Get notified when an NFT is transferred
        </Box>
        {totalWebhook > 0 && (
          <AppButton
            size={'sm'}
            px={4}
            py={1}
            className={'btn-create'}
            onClick={() => history.push(`/create-webhook-nft/${appInfo.appId}`)}
          >
            <Box className="icon-plus-circle" mr={2} /> Create
          </AppButton>
        )}
      </Flex>
      <Box mt={3} className="list-table-wrap">
        <ListWebhook
          setTotalWebhook={setTotalWebhook}
          totalWebhook={totalWebhook}
          params={params}
          appInfo={appInfo}
          setParams={setParams}
          type={WEBHOOK_TYPES.NFT_ACTIVITY}
        />

        {totalWebhook === 0 && _renderNoData()}
      </Box>
    </>
  );
};

export default PartNFTWebhooks;
