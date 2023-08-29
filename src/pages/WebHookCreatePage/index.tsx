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
import { useHistory, useLocation, useParams } from 'react-router';
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
import { CHAINS_CONFIG, IAppResponse } from 'src/utils/utils-app';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import 'src/styles/pages/AppDetail.scss';
import 'src/styles/pages/CreateHookForm.scss';
import PartFormAddressActivity from './parts/PartFormAddressActivity';
import PartFormContractActivity from './parts/PartFormContractActivity';
import PartFormNFTActivity from './parts/PartFormNFTActivity';
import PartFormTokenActivity from './parts/PartFormTokenActivity';
import PartFormTokenActivityAptos from './parts/PartFormTokenActivityAptos';
import PartFormIdentification from './parts/PartFormIdentification';
import { ROUTES } from 'src/utils/common';
import PartFormCoinActivityAptos from './parts/PartFormCoinActivityAptos';
import PartFormModuleActivityAptos from './parts/PartFormModuleActivityAptos';
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
  const location = useLocation();
  const forceUpdate = useForceRender();

  const [projectSelected, setProjectSelected] = useState<any>(null);
  const [chainSelected, setChainSelected] = useState<
    ISelect & { networks: ISelect[] }
  >(CHAINS_CONFIG[0]);
  const [networkSelected, setNetworkSelected] = useState<ISelect>(
    CHAINS_CONFIG[0].networks[0],
  );
  const [typeSelected, setTypeSelected] = useState<string>('');
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [isSendingDemoMsg, setIsSendingDemoMsg] = useState(false);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  const onChangeProject = (project: IAppResponse | null) => {
    setProjectSelected(project);
    if (!!project) {
      setTypeSelected(WEBHOOK_TYPES.ADDRESS_ACTIVITY);
    }
  };

  const onChangeChain = (chain: string, updateNetwork = false) => {
    const newChain = CHAINS_CONFIG.find((item) => item.value === chain);
    if (!!newChain) {
      setChainSelected(newChain);
      if (updateNetwork) {
        setNetworkSelected(newChain?.networks[0]);
      }
    }
  };

  const onChangeNetwork = (network: string) => {
    const newNetwork = chainSelected.networks.find(
      (item) => item.value === network,
    );
    if (!!newNetwork) {
      setNetworkSelected(newNetwork);
    }
  };

  const initProject = useCallback(async () => {
    if (!projectId) {
      return;
    }
    const project = await rf.getRequest('AppRequest').getAppDetail(projectId);
    setDataForm((prevState) => ({
      ...prevState,
      projectId,
    }));
    setProjectSelected(project);
    onChangeChain(project.chain);
    onChangeNetwork(project.network);
  }, [projectId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParams = params.get('type');
    setTypeSelected(typeParams || WEBHOOK_TYPES.ADDRESS_ACTIVITY);
  }, [location.search]);

  useEffect(() => {
    if (!!projectSelected && projectSelected.chain) {
      setDataForm((prevState) => ({
        ...prevState,
        projectId: projectSelected.projectId,
      }));
      onChangeChain(projectSelected.chain);
      onChangeNetwork(projectSelected.network);
    }
  }, [projectSelected]);

  useEffect(() => {
    let isDisabled = !validator.current.allValid();

    if (isDisabled) {
      setIsDisableSubmit(isDisabled);
      return;
    }

    switch (typeSelected) {
      case WEBHOOK_TYPES.APTOS_COIN_ACTIVITY:
      case WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY:
        isDisabled = !dataForm?.metadata?.events?.length;
        break;
      case WEBHOOK_TYPES.CONTRACT_ACTIVITY:
      case WEBHOOK_TYPES.NFT_ACTIVITY:
      case WEBHOOK_TYPES.TOKEN_ACTIVITY:
        isDisabled =
          !dataForm?.metadata?.abiFilter?.length ||
          !dataForm.metadata?.abi?.length;
        break;
      case WEBHOOK_TYPES.ADDRESS_ACTIVITY:
        isDisabled =
          !dataForm?.metadata?.addresses?.length &&
          !dataForm?.metadata?.events?.length;
        break;

      case WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY:
        isDisabled =
          !dataForm?.metadata?.events?.length &&
          !dataForm?.metadata?.functions?.length;
        break;
      default:
        break;
    }
    setIsDisableSubmit(isDisabled);
  }, [dataForm, typeSelected]);

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

  const onChangeWebhookType = (value: string) => {
    if (typeSelected === value) return;
    setDataForm({
      ...initDataCreateWebHook,
      projectId: dataForm?.projectId,
      webhookName: dataForm?.webhookName,
    });
    validator.current.fields = [];
    forceUpdate();
    setTypeSelected(value);
  };

  const _renderFormAddressActivity = () => {
    return (
      <PartFormAddressActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={typeSelected}
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
        type={typeSelected}
        validator={validator}
      />
    );
  };

  const _renderFormNFTActivity = () => {
    return (
      <PartFormNFTActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={typeSelected}
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
        type={typeSelected}
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
    switch (typeSelected) {
      case WEBHOOK_TYPES.ADDRESS_ACTIVITY:
        return _renderFormAddressActivity();
      case WEBHOOK_TYPES.NFT_ACTIVITY:
        return _renderFormNFTActivity();
      case WEBHOOK_TYPES.CONTRACT_ACTIVITY:
        return _renderFormContractActivity();
      case WEBHOOK_TYPES.TOKEN_ACTIVITY:
        return _renderFormTokenActivity();
      case WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY:
        return _renderFormModuleActivityAptos();
      case WEBHOOK_TYPES.APTOS_COIN_ACTIVITY:
        return _renderFormCoinActivityAptos();
      case WEBHOOK_TYPES.APTOS_TOKEN_ACTIVITY:
        return _renderFormTokenActivityAptos();
      default:
        return null;
    }
  };

  const handleSendDemoMsg = async () => {
    if (isSendingDemoMsg) return;
    setIsSendingDemoMsg(true);

    try {
      await rf.getRequest('RegistrationRequest').sendDemoWebhook({
        chain: chainSelected.value,
        type: typeSelected,
        network: networkSelected.value,
        webhook: dataForm.webhook,
      });
      toastSuccess({
        message: 'Send Demo Successfully!',
      });
    } catch (e: any) {
      toastError({ message: e?.message || 'Send Demo Fail!' });
    }

    setTimeout(() => {
      setIsSendingDemoMsg(false);
    }, 4000);
  };

  const handleSubmitForm = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }

    const isEvmCheckboxInvalid =
      isEVMNetwork(chainSelected.value) &&
      !dataForm.metadata?.abiFilter?.length &&
      typeSelected !== WEBHOOK_TYPES.ADDRESS_ACTIVITY;
    const isAptosCheckboxInvalid =
      isAptosNetwork(chainSelected.value) &&
      typeSelected !== WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
      typeSelected !== WEBHOOK_TYPES.APTOS_MODULE_ACTIVITY &&
      !dataForm.metadata?.events?.length;

    if (isEvmCheckboxInvalid || isAptosCheckboxInvalid) {
      toastError({ message: 'At least one checkbox must be checked.' });
      return;
    }

    const data = {
      ...dataForm,
      type: typeSelected,
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

  const _renderIdentification = () => {
    return (
      <PartFormIdentification
        dataForm={dataForm}
        setDataForm={setDataForm}
        validator={validator}
        onSelectProject={onChangeProject}
      />
    );
  };

  const _renderDetailInfo = () => {
    const onSelectChain = (chain: string) => {
      onChangeChain(chain, true);
      setTypeSelected(optionTypes[0].value);
    };

    return (
      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Chain'} customWidth={'32%'} isRequired>
            <AppSelect2
              size="large"
              onChange={onSelectChain}
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
              value={typeSelected}
              onChange={onChangeWebhookType}
            />
          </AppField>
        </Flex>
        {_renderFormWebhook()}
      </Box>
    );
  };

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
                    rule: ['required', 'url', 'maxYourUrl'],
                  }}
                  pr={{ base: 5, md: '220px' }}
                  endAdornment={
                    <AppButton
                      onClick={handleSendDemoMsg}
                      disabled={
                        isDisableSubmit || chainSelected.value === CHAINS.SUI
                      }
                      w={190}
                      size={'sm'}
                    >
                      {isSendingDemoMsg ? 'Message sent!' : 'Send Demo Message'}
                    </AppButton>
                  }
                />
                <Show below="md">
                  <AppButton
                    onClick={handleSendDemoMsg}
                    disabled={
                      isDisableSubmit || chainSelected.value === CHAINS.SUI
                    }
                    w={190}
                    size={'sm'}
                  >
                    {isSendingDemoMsg ? 'Message sent!' : 'Send Demo Message'}
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
