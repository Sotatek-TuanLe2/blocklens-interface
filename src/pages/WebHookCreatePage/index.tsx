import { Box, Flex, Hide, Show, Text } from '@chakra-ui/react';
import { CHAINS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppCard,
  AppLink,
  AppField,
  AppSelect2,
  AppInput,
  AppButton,
} from 'src/components';
import { BasePage } from 'src/layouts';
import { createValidator } from 'src/utils/utils-validator';
import { isEVMNetwork } from 'src/utils/utils-network';
import {
  optionsWebhookAptosType,
  optionsWebhookType,
} from 'src/utils/utils-webhook';
import { CHAINS_CONFIG } from 'src/utils/utils-app';
import { toastError } from 'src/utils/utils-notify';
import 'src/styles/pages/AppDetail.scss';
import 'src/styles/pages/CreateHookForm.scss';
import PartFormAddressActivity from '../CreateWebhookPage/parts/PartFormAddressActivity';
import PartFormContractActivity from '../CreateWebhookPage/parts/PartFormContractActivity';
import PartFormNFTActivity from '../CreateWebhookPage/parts/PartFormNFTActivity';
import PartFormTokenActivity from '../CreateWebhookPage/parts/PartFormTokenActivity';
import PartFormTokenActivityAptos from '../CreateWebhookPage/parts/PartFormTokenActivityAptos';

import PartFormIdentification from './parts/PartFormIdentification';
import { ROUTES } from '../../utils/common';
import PartFormCoinActivityAptos from '../CreateWebhookPage/parts/PartFormCoinActivityAptos';
import PartFormModuleActivityAptos from '../CreateWebhookPage/parts/PartFormModuleActivityAptos';

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
  name?: string;
  projectId?: string;
  hashTags?: string[];
  metadata?: IMetadata;
}

const initDataCreateWebHook = {
  webhook: '',
  type: '',
  hashTags: [],
  projectId: '',
  name: 'webhook 1',
  metadata: {
    coinType: '',
    events: [],
    addresses: [],
    address: '',
  },
};

const WebHookCreatePage: React.FC = () => {
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.ADDRESS_ACTIVITY);
  const [chainSelected, setChainSelected] = useState<any>(CHAINS_CONFIG[0]);
  const [networkSelected, setNetworkSelected] = useState<any>(
    CHAINS_CONFIG[0].networks[0],
  );

  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
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
  };

  const optionTypes = useMemo(() => {
    if (chainSelected.value === CHAINS.APTOS) {
      return optionsWebhookAptosType;
    }

    if (!isEVMNetwork(chainSelected.value)) {
      return optionsWebhookType.filter(
        (item) => item.value === WEBHOOK_TYPES.ADDRESS_ACTIVITY,
      );
    }

    return optionsWebhookType;
  }, [chainSelected]);

  const _renderFormAddressActivity = () => {
    return (
      <PartFormAddressActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={type}
        validator={validator}
        chain={chainSelected.value}
      />
    );
  };

  const _renderFormContractActivity = () => {
    return (
      <PartFormContractActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={type}
        validator={validator}
      />
    );
  };

  const _renderFormNFTActivity = () => {
    return (
      <PartFormNFTActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={type}
        validator={validator}
        isCreateWithoutProject
      />
    );
  };

  const _renderFormTokenActivity = () => {
    return (
      <PartFormTokenActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={type}
        validator={validator}
      />
    );
  };

  const _renderFormModuleActivityAptos = () => {
    return (
      <PartFormModuleActivityAptos
        dataForm={dataForm}
        onChangeForm={setDataForm}
        validator={validator}
      />
    );
  };

  const _renderFormCoinActivityAptos = () => {
    return (
      <Box className="create-webhook__coin-aptos">
        <PartFormCoinActivityAptos
          dataForm={dataForm}
          setDataForm={setDataForm}
          validator={validator}
        />
      </Box>
    );
  };

  const _renderFormTokenActivityAptos = () => {
    return (
      <Box className="create-webhook__token-aptos">
        <PartFormTokenActivityAptos
          dataForm={dataForm}
          setDataForm={setDataForm}
          validator={validator}
          isHiddenName={true}
        />
      </Box>
    );
  };

  const _renderFormWebhook = () => {
    if (type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderFormNFTActivity();
    }

    if (type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderFormContractActivity();
    }

    if (type === WEBHOOK_TYPES.TOKEN_ACTIVITY) {
      return _renderFormTokenActivity();
    }

    if (type === WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY) {
      return _renderFormModuleActivityAptos();
    }

    if (type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) {
      return _renderFormCoinActivityAptos();
    }

    if (type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY) {
      return _renderFormTokenActivityAptos();
    }

    return _renderFormAddressActivity();
  };

  useEffect(() => {
    setType(optionTypes[0].value);
  }, [optionTypes]);

  const handleSubmitForm = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }

    if (
      !dataForm.metadata?.abiFilter?.length &&
      type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
      isEVMNetwork(chainSelected.value)
    ) {
      toastError({ message: 'At least one checkbox must be checked.' });
      return;
    }

    const data = {
      ...dataForm,
      type,
      chain: chainSelected.value,
      network: networkSelected.value,
      metadata: {
        ...dataForm.metadata,
        tokenIds:
          dataForm?.metadata?.tokenIds
            ?.split(',')
            .filter((item: string) => !!item)
            .map((item: string) => +item.trim()) || [],
      },
    };

    try {
      console.log(data, 'dataForm');
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const isDisabled =
        !validator.current.allValid() ||
        (type === WEBHOOK_TYPES.CONTRACT_ACTIVITY &&
          !dataForm.metadata?.abi?.length) ||
        (type === WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
          !dataForm?.metadata?.addresses?.length) ||
        ((type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY ||
          type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) &&
          !dataForm?.metadata?.events?.length) ||
        (type === WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY &&
          !dataForm?.metadata?.events?.length &&
          !dataForm?.metadata?.address &&
          !dataForm?.metadata?.functions?.length);
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, type]);

  const _renderIdentification = () => {
    return (
      <PartFormIdentification
        dataForm={dataForm}
        setDataForm={setDataForm}
        validator={validator}
      />
    );
  };

  const _renderDetailInfo = () => {
    return (
      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Chain'} customWidth={'32%'} isRequired>
            <AppSelect2
              size="large"
              onChange={(value: string) => {
                setChainSelected(
                  CHAINS_CONFIG.find((chain) => chain.value === value),
                );
                setNetworkSelected(
                  CHAINS_CONFIG.find((chain) => chain.value === value)
                    ?.networks[0],
                );
              }}
              options={CHAINS_CONFIG}
              value={chainSelected.value}
            />
          </AppField>

          <AppField label={'Network'} customWidth={'32%'} isRequired>
            <AppSelect2
              size="large"
              onChange={(value: string) => {
                setNetworkSelected(
                  chainSelected.networks.find(
                    (network: any) => network.value === value,
                  ),
                );
              }}
              options={chainSelected.networks}
              value={networkSelected.value}
            />
          </AppField>

          <AppField label={'Webhook Type'} customWidth={'32%'} isRequired>
            <AppSelect2
              className="select-type-webhook"
              size="large"
              options={optionTypes}
              value={type}
              onChange={onChangeWebhookType}
            />
          </AppField>
        </Flex>

        {_renderFormWebhook()}
      </Box>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const isDisabled =
        !validator.current.allValid() ||
        (type === WEBHOOK_TYPES.CONTRACT_ACTIVITY &&
          !dataForm.metadata?.abi?.length) ||
        (type === WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
          !dataForm?.metadata?.addresses?.length) ||
        ((type === WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY ||
          type === WEBHOOK_TYPES.APTOS_COIN_ACTIVITY) &&
          !dataForm?.metadata?.events?.length) ||
        (type === WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY &&
          !dataForm?.metadata?.events?.length &&
          !dataForm?.metadata?.address &&
          !dataForm?.metadata?.functions?.length);
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, type]);

  useEffect(() => {
    setType(optionTypes[0].value);
  }, [optionTypes]);

  return (
    <BasePage className="create-webhook-container">
      <>
        <Flex className="create-webhook__header">
          <Flex className="name">
            <AppLink to={ROUTES.TRIGGERS}>
              <Box className="icon-arrow-left" mr={3.5} />
            </AppLink>
            <Box className={'title-mobile'}>Create Webhook</Box>
          </Flex>
        </Flex>
        <Flex gap={5} flexDir={{ base: 'column', lg: 'row' }}>
          <Box w={{ base: 'full', lg: 330 }}>
            <AppCard className={'create-webhook__identification'}>
              {_renderIdentification()}
            </AppCard>
          </Box>
          <Box flex={1}>
            <AppCard className={'create-webhook__detail-info form-create'}>
              {_renderDetailInfo()}
            </AppCard>

            <AppCard className={'create-webhook__url'} mt={5}>
              <AppField label={'Your URL'} customWidth={'100%'} isRequired>
                <AppInput
                  className="create-webhook__url-input"
                  value={dataForm.webhook}
                  onChange={(e) => {
                    setDataForm({
                      ...dataForm,
                      webhook: e.target.value.trim(),
                    });
                  }}
                  validate={{
                    name: `webhook`,
                    validator: validator.current,
                    rule: ['required', 'url'],
                  }}
                  pr={{ base: 5, md: '220px' }}
                  endAdornment={
                    <AppButton disabled w={190} size={'sm'}>
                      Send Demo Message
                    </AppButton>
                  }
                />
                <Show below="md">
                  <AppButton disabled w={190} size={'sm'}>
                    Send Demo Message
                  </AppButton>
                </Show>
              </AppField>
            </AppCard>

            <Flex justifyContent={['center', 'flex-end']} mt={5}>
              <AppButton
                disabled={isDisableSubmit}
                onClick={handleSubmitForm}
                size={'lg'}
              >
                Create webhook
              </AppButton>
            </Flex>
          </Box>
        </Flex>
      </>
    </BasePage>
  );
};
export default WebHookCreatePage;
