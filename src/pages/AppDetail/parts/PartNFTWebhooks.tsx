import { Flex, Box } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import ListWebhook from './ListWebhook';
import { isMobile } from 'react-device-detect';

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
        <Box className="icon-no-data" mb={4} />
        Create your webhook to start experiencing Blocksniper with NFT Activity!
        <AppButton
          isDisabled={isDisabledApp}
          size={'lg'}
          onClick={() =>
            history.push(
              `/create-webhook/${appInfo.appId}?type=${WEBHOOK_TYPES.NFT_ACTIVITY}`,
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
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mx={isMobile ? 5 : 10}
      >
        <Box className="description">
          Get notified whenever a NFT occurs activity
        </Box>
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
