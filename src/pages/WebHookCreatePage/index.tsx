import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { CHAINS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import React, { useCallback, useRef, useState } from 'react';
import {
  AppCard,
  AppLink,
  AppEditable,
  AppEditableTags,
  AppField,
  AppComplete,
} from 'src/components';
import 'src/styles/pages/CreateHookForm.scss';
import { BasePage } from 'src/layouts';
import { createValidator } from 'src/utils/utils-validator';

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
  hashTags: string[];
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

const initDataCreateWebHook = {
  webhook: '',
  type: '',
  hashTags: [],
  metadata: {
    coinType: '',
    events: [],
    addresses: [],
    address: '',
  },
};

const WebHookCreatePage: React.FC = () => {
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const [, updateState] = useState<any>();

  const forceUpdate = useCallback(() => updateState({}), []);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  const onChangeWebhookType = (value: string) => {
    if (type === value) return;
    setDataForm(initDataCreateWebHook);
    validator.current.fields = [];
    forceUpdate();
    setType(value);
    // onClearFile();
  };

  const _renderIdentification = () => {
    return (
      <>
        <Text className="title">Webhook Name</Text>
        <AppEditable defaultValue="Webhook 1" />
        <Text className="title">Hashtag</Text>
        <AppEditableTags
          onSubmit={(value) => {
            setDataForm((pre) => ({
              ...pre,
              hashTags: [...pre.hashTags, value],
            }));
          }}
          onRemove={(value) => {
            const newValue = dataForm.hashTags.filter((tag) => value !== tag);
            setDataForm((pre) => ({
              ...pre,
              hashTags: newValue,
            }));
          }}
          tags={dataForm.hashTags}
        />
        <Text className="title">Project</Text>
        <AppField label={'Webhook Type'} customWidth={'100%'} isRequired>
          <AppComplete
            className="select-type-webhook"
            size="large"
            options={optionsWebhookAptosType}
            value={type}
            onChange={onChangeWebhookType}
            extraFooter={() => <Box>hihi</Box>}
          />
        </AppField>
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
