import { Flex, Box } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import React, { FC, useState } from 'react';
import { AppButton, AppCard } from 'src/components';
import { useHistory } from 'react-router';
import { IAppResponse } from 'src/utils/utils-app';
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

  const _renderNoData = () => {
    return (
      <Flex alignItems={'center'} my={10} flexDirection={'column'}>
        Set up your first NFT activity webhook!
        <Box
          className="button-create-webhook"
          mt={2}
          onClick={() => history.push(`/create-webhook-nft/${appInfo.appId}`)}
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
              NFT Activity
              <Box className="description">
                Get notified when an NFT is transferred
              </Box>
            </Box>
          </Flex>
          <AppButton
            textTransform="uppercase"
            size={'md'}
            onClick={() => history.push(`/create-webhook-nft/${appInfo.appId}`)}
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
            type={WEBHOOK_TYPES.NFT_ACTIVITY}
          />

          {totalWebhook === 0 && _renderNoData()}
        </Box>
      </AppCard>
    </>
  );
};

export default PartNFTWebhooks;
