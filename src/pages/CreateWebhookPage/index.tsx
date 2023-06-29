import { Box, Flex, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppLink,
  AppSelect2,
} from 'src/components';
import { BasePage } from 'src/layouts';
import rf from 'src/requests/RequestFactory';
import { getUserStats } from 'src/store/user';
import 'src/styles/pages/AppDetail.scss';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { isEVMNetwork } from 'src/utils/utils-network';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import { CHAINS, WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import PartFormAddressActivity from './parts/PartFormAddressActivity';
import PartFormCoinActivityAptos from './parts/PartFormCoinActivityAptos';
import PartFormContractActivity from './parts/PartFormContractActivity';
import PartFormModuleActivityAptos from './parts/PartFormModuleActivityAptos';
import PartFormNFTActivity from './parts/PartFormNFTActivity';
import PartFormTokenActivity from './parts/PartFormTokenActivity';
import PartFormTokenActivityAptos from './parts/PartFormTokenActivityAptos';

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

const optionsWebhookType = [
  {
    label: 'Address Activity',
    value: WEBHOOK_TYPES.ADDRESS_ACTIVITY,
  },
  {
    label: 'Contract Activity',
    value: WEBHOOK_TYPES.CONTRACT_ACTIVITY,
  },
  {
    label: 'NFT Activity',
    value: WEBHOOK_TYPES.NFT_ACTIVITY,
  },
  {
    label: 'Token Activity',
    value: WEBHOOK_TYPES.TOKEN_ACTIVITY,
  },
];

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

const CreateWebhook = () => {
  const { id: appId } = useParams<{ id: string }>();
  const initDataCreateWebHook = {
    webhook: '',
    type: '',
    metadata: {
      coinType: '',
      events: [],
      addresses: [],
      address: '',
    },
  };

  const history = useHistory();
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const [, updateState] = useState<any>();

  const forceUpdate = useCallback(() => updateState({}), []);

  const dispatch = useDispatch();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const typeParams = params.get('type');

  const getAppInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(appId)) as any;
      setAppInfo(res);
    } catch (error: any) {
      setAppInfo({});
    }
  }, [appId]);

  const optionTypes = useMemo(() => {
    if (appInfo.chain === CHAINS.APTOS) {
      return optionsWebhookAptosType;
    }

    if (!isEVMNetwork(appInfo.chain)) {
      return optionsWebhookType.filter(
        (item) => item.value === WEBHOOK_TYPES.ADDRESS_ACTIVITY,
      );
    }

    return optionsWebhookType;
  }, [appInfo]);

  useEffect(() => {
    if (
      !!Object.keys(appInfo).length &&
      !isEVMNetwork(appInfo.chain) &&
      appInfo.chain !== CHAINS.APTOS
    ) {
      setType(WEBHOOK_TYPES.ADDRESS_ACTIVITY);
      return;
    }

    if (!!typeParams) {
      setType(typeParams);
    }
  }, [appInfo, typeParams]);

  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );

  const handleSubmitForm = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }

    if (
      !dataForm.metadata?.abiFilter?.length &&
      type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY &&
      isEVMNetwork(appInfo.chain)
    ) {
      toastError({ message: 'At least one checkbox must be checked.' });
      return;
    }

    const data = {
      ...dataForm,
      type,
      chain: appInfo.chain,
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
      await rf.getRequest('RegistrationRequest').addRegistrations(appId, data);
      dispatch(getUserStats());
      history.push(`/app/${appId}`);
      toastSuccess({ message: 'Create Successfully!' });
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
          !dataForm.metadata?.events?.length &&
          !dataForm.metadata?.functions?.length);
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm]);

  const onChangeWebhookType = (value: string) => {
    if (type === value) return;
    setDataForm(initDataCreateWebHook);
    validator.current.fields = [];
    forceUpdate();
    setType(value);
    // onClearFile();
  };

  const _renderFormAddressActivity = () => {
    return (
      <PartFormAddressActivity
        dataForm={dataForm}
        setDataForm={setDataForm}
        type={type}
        validator={validator}
        appInfo={appInfo}
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
      <PartFormCoinActivityAptos
        dataForm={dataForm}
        setDataForm={setDataForm}
        validator={validator}
      />
    );
  };

  const _renderFormTokenActivityAptos = () => {
    return (
      <PartFormTokenActivityAptos
        dataForm={dataForm}
        setDataForm={setDataForm}
        validator={validator}
      />
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

  const _renderNoApp = () => {
    return <Flex justifyContent="center">App Not Found</Flex>;
  };

  const _renderCreateWebhook = () => {
    return (
      <>
        <Flex className="app-info">
          <Flex className="name">
            <AppLink to={`/app/${appId}`}>
              <Box className="icon-arrow-left" mr={3.5} />
            </AppLink>
            <Box className={'title-mobile'}>Create Webhook</Box>
          </Flex>
        </Flex>
        <AppCard className={'form-create'}>
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField label={'Webhook Type'} customWidth={'49%'} isRequired>
              <AppSelect2
                className="select-type-webhook"
                size="large"
                options={optionTypes}
                value={type}
                onChange={onChangeWebhookType}
              />
            </AppField>

            <AppField
              label={'Webhook URL'}
              customWidth={'49%'}
              isRequired
              note="The endpoint to send notifications to."
            >
              <AppInput
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
              />
            </AppField>
          </Flex>

          {_renderFormWebhook()}

          <Flex className="box-btn-create">
            <AppButton
              disabled={
                isDisableSubmit || appInfo.status === APP_STATUS.DISABLED
              }
              onClick={handleSubmitForm}
              size={'lg'}
            >
              Create webhook
            </AppButton>
          </Flex>
        </AppCard>
      </>
    );
  };

  return (
    <BasePage className="app-detail" onInitPage={getAppInfo}>
      {!appInfo || !Object.values(appInfo).length
        ? _renderNoApp()
        : _renderCreateWebhook()}
    </BasePage>
  );
};

export default CreateWebhook;
