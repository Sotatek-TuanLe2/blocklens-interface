import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { CHAINS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import React from 'react';
import { AppCard, AppLink, AppEditable, AppEditableTags } from 'src/components';
import 'src/styles/pages/CreateHookForm.scss';
import { BasePage } from 'src/layouts';

interface IMetadata {
  coinType?: string;
  events?: string[];
  functions?: string[];
  addresses?: string[];
  address?: string;
  abi?: any[];
  abiFilter?: any[];
  tokenIds?: string;
  creatorAddress?: string;
  collectionName?: string;
  name?: string;
}

export interface IDataForm {
  webhook: string;
  type: string;
  metadata?: IMetadata;
}

const optionsWebhookAptosType = [
  {
    label: 'Address Activity',
    value: WEBHOOK_TYPES.ADDRESS_ACTIVITY,
  },
  {
    label: 'Coin Activity',
    value: WEBHOOK_TYPES.APTOS_COIN_ACTIVITY,
  },
  {
    label: 'Token Activity',
    value: WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY,
  },
  {
    label: 'Module Activity',
    value: WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY,
  },
];

const WebHookCreatePage: React.FC = () => {
  const _renderIdentification = () => {
    return (
      <>
        <Text className="title">Webhook Name</Text>
        <AppEditable defaultValue="Webhook 1" />
        <Text className="title">Hashtag</Text>
        <AppEditableTags tags={['newproject1']} />
        <Text className="title">Project</Text>
      </>
    );
  };
  return (
    <BasePage className="create-webhook-container">
      <>
        <Flex className="create-webhook__header">
          <Flex className="name">
            <AppLink to={`/`}>
              <Box className="icon-arrow-left" mr={3.5} />
            </AppLink>
            <Box className={'title-mobile'}>Create Webhook</Box>
          </Flex>
        </Flex>
        <Flex gap={5}>
          <Box w={330}>
            <AppCard className={'create-webhook__identification'}>
              {_renderIdentification()}
            </AppCard>
          </Box>
          <Box flex={1}>grid con</Box>
        </Flex>
      </>
    </BasePage>
  );
};
export default WebHookCreatePage;
