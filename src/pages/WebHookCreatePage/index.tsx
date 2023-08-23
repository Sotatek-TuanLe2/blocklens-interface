import { Box, Flex, Show, Text } from '@chakra-ui/react';
import { CHAINS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
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
import { isAptosNetwork, isEVMNetwork } from 'src/utils/utils-network';
import {
  optionsWebhookAptosType,
  optionsWebhookType,
} from 'src/utils/utils-webhook';
import { CHAINS_CONFIG } from 'src/utils/utils-app';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import 'src/styles/pages/AppDetail.scss';
import 'src/styles/pages/CreateHookForm.scss';
import PartFormAddressActivity from '../CreateWebhookPage/parts/PartFormAddressActivity';
import PartFormContractActivity from '../CreateWebhookPage/parts/PartFormContractActivity';
import PartFormNFTActivity from '../CreateWebhookPage/parts/PartFormNFTActivity';
import PartFormTokenActivity from '../CreateWebhookPage/parts/PartFormTokenActivity';
import PartFormTokenActivityAptos from '../CreateWebhookPage/parts/PartFormTokenActivityAptos';
import PartFormIdentification from './parts/PartFormIdentification';
import { ROUTES } from 'src/utils/common';
import PartFormCoinActivityAptos from '../CreateWebhookPage/parts/PartFormCoinActivityAptos';
import PartFormModuleActivityAptos from '../CreateWebhookPage/parts/PartFormModuleActivityAptos';
import rf from 'src/requests/RequestFactory';
import { getUserStats } from 'src/store/user';
import { useForceRender } from 'src/hooks/useForceRender';

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
  module?: string;
}

export interface IDataForm {
  webhook: string;
  type: string;
  webhookName?: string;
  projectId?: string;
  hashTags?: string[];
  metadata?: IMetadata;
}

const initDataCreateWebHook = {
  webhook: '',
  type: '',
  hashTags: [],
  projectId: '',
  webhookName: 'Untitled Webhook',
  metadata: {
    coinType: '',
    events: [],
    addresses: [],
    address: '',
    name: '',
    module: '',
  },
};

interface ISelect {
  label: string;
  value: string;
  icon: string;
}

const WebHookCreatePage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const history = useHistory();
  const forceUpdate = useForceRender();

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.ADDRESS_ACTIVITY);
  const [chainSelected, setChainSelected] = useState<ISelect & { networks: ISelect[] }>(CHAINS_CONFIG[0]);
  const [networkSelected, setNetworkSelected] = useState<ISelect>(
    CHAINS_CONFIG[0].networks[0],
  );
  const [projectSelected, setProjectSelected] = useState<any>(null);

  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  useEffect(() => {
    if (projectSelected && projectSelected.chain) {
      const newChain = CHAINS_CONFIG.find((item) => item.value === projectSelected?.chain);
      if (!!newChain) {
        setChainSelected(newChain);
      }
    }
  }, [projectSelected]);

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

  const initProject = useCallback(async () => {
    setDataForm(prevState => ({
      ...prevState,
      projectId,
    }));
  }, [projectId]);

  const onChangeWebhookType = (value: string) => {
    if (type === value) return;
    setDataForm({
      ...initDataCreateWebHook,
      projectId: dataForm?.projectId,
      webhookName: dataForm?.webhookName,
    });
    validator.current.fields = [];
    forceUpdate();
    setType(value);
  };

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

    const isEvmCheckboxInvalid =
      isEVMNetwork(chainSelected.value) &&
      !dataForm.metadata?.abiFilter?.length &&
      type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY;
    const isAptosCheckboxInvalid =
      isAptosNetwork(chainSelected.value) &&
      type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
      type !== WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY &&
      !dataForm.metadata?.events?.length;

    if (isEvmCheckboxInvalid || isAptosCheckboxInvalid) {
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
        name: dataForm?.metadata?.name ? dataForm?.metadata?.name.trim() : '',
      },
    };

    try {
      if (!!data.projectId) {
        await rf
          .getRequest('RegistrationRequest')
          .addRegistrations(data.projectId, data);
      } else {
        await rf
          .getRequest('RegistrationRequest')
          .addRegistrationWithoutApp(data);
      }
      dispatch(getUserStats());
      history.push(ROUTES.TRIGGERS);
      toastSuccess({ message: 'Create Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const isDisabled =
        !validator.current.allValid() ||
        ((type === WEBHOOK_TYPES.CONTRACT_ACTIVITY ||
          type === WEBHOOK_TYPES.TOKEN_ACTIVITY ||
          type === WEBHOOK_TYPES.NFT_ACTIVITY) &&
          !dataForm.metadata?.abi?.length) ||
        (type === WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
          !dataForm?.metadata?.addresses?.length &&
          !dataForm?.metadata?.events?.length) ||
        (type === WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY &&
          (!dataForm?.metadata?.events?.length ||
            !dataForm?.metadata?.functions?.length) &&
          !dataForm?.metadata?.address &&
          !dataForm?.metadata?.module?.length);
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, type]);

  const _renderIdentification = () => {
    return (
      <PartFormIdentification
        dataForm={dataForm}
        setDataForm={setDataForm}
        validator={validator}
        setProjectSelected={setProjectSelected}
      />
    );
  };

  const _renderDetailInfo = () => {
    const onChangeChain = (value: string) => {
      const newChain = CHAINS_CONFIG.find((chain) => chain.value === value);
      if (!!newChain) {
        setChainSelected(newChain);
        setNetworkSelected(newChain?.networks[0]);
      }
    };

    const onChangeNetwork = (value: string) => {
      const newNetwork = chainSelected.networks.find(network => network.value === value);
      if (!!newNetwork) {
        setNetworkSelected(newNetwork);
      }
    };

    return (
      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Chain'} customWidth={'32%'} isRequired>
            <AppSelect2
              size="large"
              onChange={onChangeChain}
              disabled={!!projectSelected}
              options={CHAINS_CONFIG}
              value={chainSelected.value}
            />
          </AppField>

          <AppField label={'Network'} customWidth={'32%'} isRequired>
            <AppSelect2
              size="large"
              onChange={onChangeNetwork}
              options={chainSelected.networks}
              value={networkSelected.value}
              disabled={!!projectSelected}
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
    setType(optionTypes[0].value);
  }, [optionTypes]);

  return (
    <BasePage className="create-webhook-container" onInitPage={initProject}>
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
                Create
              </AppButton>
            </Flex>
          </Box>
        </Flex>
      </>
    </BasePage>
  );
};
export default WebHookCreatePage;
