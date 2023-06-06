import { Box, Flex, Link, Text } from '@chakra-ui/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePage } from 'src/layouts';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppLink,
  AppSelect2,
  AppTextarea,
  TYPE_ABI,
} from 'src/components';
import AppUploadABI from 'src/components/AppUploadABI';
import { createValidator } from 'src/utils/utils-validator';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { isValidAddressEVM } from 'src/utils/utils-helper';
import { CloseIcon } from '@chakra-ui/icons';
import { Link as ReactLink } from 'react-router-dom';
import { APP_STATUS, IAppResponse } from 'src/utils/utils-app';
import { isEVMNetwork } from 'src/utils/utils-network';
import { useLocation } from 'react-router';
import { DownloadIcon } from 'src/assets/icons';
import { useDispatch } from 'react-redux';
import { getUserStats } from 'src/store/user';

const FILE_CSV_EXAMPLE = '/abi/CSV_Example.csv';

interface IDataForm {
  webhook: string;
  address: string;
  addresses: string[];
  tokenIds: string;
  abi: any[];
  type: string;
  abiFilter: any[];
}

const optionsWebhookType = [
  {
    label: 'NFT Activity',
    value: WEBHOOK_TYPES.NFT_ACTIVITY,
  },
  {
    label: 'Address Activity',
    value: WEBHOOK_TYPES.ADDRESS_ACTIVITY,
  },
  {
    label: 'Contract Activity',
    value: WEBHOOK_TYPES.CONTRACT_ACTIVITY,
  },
];

const CreateWebhook = () => {
  const { id: appId } = useParams<{ id: string }>();
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
    tokenIds: '',
    abi: [],
    type: '',
    abiFilter: [],
    addresses: [],
  };

  const history = useHistory();
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const [fileSelected, setFileSelected] = useState<any>({});
  const [addressesValue, setAddressesValue] = useState<string>('');
  const [isInsertManuallyAddress, setIsInsertManuallyAddress] =
    useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const inputRef = useRef<any>(null);

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
    if (!isEVMNetwork(appInfo.chain)) {
      return optionsWebhookType.filter(
        (item) => item.value === WEBHOOK_TYPES.ADDRESS_ACTIVITY,
      );
    }
    return optionsWebhookType;
  }, [appInfo]);

  useEffect(() => {
    if (!!Object.keys(appInfo).length && !isEVMNetwork(appInfo.chain)) {
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

    if (!dataForm.abiFilter.length && type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY) {
      toastError({ message: 'At least one checkbox must be checked.' });
      return;
    }

    const data = {
      ...dataForm,
      type,
      tokenIds: dataForm.tokenIds
        .split(',')
        .filter((item: string) => !!item)
        .map((item: string) => +item.trim()),
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
        (type === WEBHOOK_TYPES.CONTRACT_ACTIVITY && !dataForm.abi.length) ||
        (type === WEBHOOK_TYPES.ADDRESS_ACTIVITY && isNotCorrectAddress);
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, addressesValue]);

  const onClearFile = () => {
    if (!isInsertManuallyAddress) {
      setFileSelected({});
      inputRef.current.value = null;
      setAddressesValue('');
      setDataForm({ ...dataForm, addresses: [] });
    }
  };

  const onChangeWebhookType = (value: string) => {
    if (type === value) return;
    setDataForm(initDataCreateWebHook);
    validator.current.fields = [];
    forceUpdate();
    setType(value);
    onClearFile();
  };

  const _renderFormContractActivity = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Contract Address'} customWidth={'100%'} isRequired>
          <AppInput
            value={dataForm.address}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                address: e.target.value.trim(),
              })
            }
            hiddenErrorText={type !== WEBHOOK_TYPES.CONTRACT_ACTIVITY}
            validate={{
              name: `contractAddress`,
              validator: validator.current,
              rule: 'required|isAddress',
            }}
          />
        </AppField>
        <AppUploadABI
          type={TYPE_ABI.CONTRACT}
          onChange={(abi, abiFilter) =>
            setDataForm({ ...dataForm, abi, abiFilter })
          }
        />
      </Flex>
    );
  };

  const addressesInput = useMemo(() => {
    return addressesValue.split('\n');
  }, [addressesValue]);

  const isValidAddress = (address: string) => {
    if (isEVMNetwork(appInfo.chain)) return isValidAddressEVM(address);
    return true;
  };

  const addressesInvalid = useMemo(() => {
    return addressesInput.map((address: string, index: number) => ({
      value: address,
      index: !isValidAddress(address) ? index : -1,
    }));
  }, [addressesInput]);

  const addressValid = useMemo(() => {
    return addressesInput.filter((address: string) => isValidAddress(address));
  }, [addressesInput]);

  useEffect(() => {
    setDataForm({ ...dataForm, addresses: addressValid });
  }, [addressesInput]);

  const onClearAddressInvalid = () => {
    setDataForm({ ...dataForm, addresses: addressValid });
    setAddressesValue(addressValid.join('\n'));
  };

  const isNotCorrectAddress = useMemo(
    () => addressesInvalid.some(({ index }) => index > -1),
    [addressesInvalid],
  );

  const _renderFormAddressActivity = () => {
    const onChangeAddresses = (e: any) => {
      const value = e.target.value.split(new RegExp(/,|;|\n|\s/));
      setAddressesValue(value.join('\n'));
    };

    const handleFileSelect = (evt: any, dropFile?: any) => {
      const file = dropFile || evt.target.files[0];
      if (file.type !== 'text/csv') {
        toastError({ message: 'The file must be csv file type' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        setAddressesValue(data?.split('\r\n').slice(0, -1).join('\n'));
        setFileSelected(dropFile || evt.target.files[0]);
      };

      reader.readAsBinaryString(file);
    };

    const _renderNameFile = () => {
      if (fileSelected?.name) {
        return (
          <>
            <Box className="file-name">
              {fileSelected?.name}
              <CloseIcon
                onClick={onClearFile}
                className={'icon-clear'}
                ml={3}
              />
            </Box>
            <AppTextarea rows={6} isDisabled={true} value={addressesValue} />
          </>
        );
      }
    };

    const onDropHandler = (ev: any) => {
      ev.preventDefault();

      let file: any = {};
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        file = [...ev.dataTransfer.items]
          .find((item: any) => item.kind === 'file')
          .getAsFile();
      } else {
        // Use DataTransfer interface to access the file(s)
        file = ev.dataTransfer.files[0];
      }
      handleFileSelect(null, file);
    };

    const onDragOver = (e: any) => e.preventDefault();

    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField
          label={`${appInfo.chain} Addresses`}
          customWidth={'100%'}
          isRequired
        >
          <Box
            className="link type-upload-address"
            cursor="pointer"
            onClick={() => {
              setIsInsertManuallyAddress(!isInsertManuallyAddress);
              setDataForm({ ...dataForm, addresses: [] });
              setAddressesValue('');
              validator.current.fields = [];
              forceUpdate();
              onClearFile();
            }}
          >
            {!isInsertManuallyAddress ? 'Insert Manually' : 'Upload File'}
          </Box>
          {isInsertManuallyAddress ? (
            <>
              <AppTextarea
                rows={6}
                value={addressesValue}
                onChange={onChangeAddresses}
                hiddenErrorText={type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY}
                validate={{
                  name: `addresses`,
                  validator: validator.current,
                  rule: 'required',
                }}
              />
            </>
          ) : (
            <>
              <label onDrop={onDropHandler} onDragOver={onDragOver}>
                <Box className="box-upload">
                  <Box className="icon-upload" mb={4} />
                  <Box maxW={'365px'} textAlign={'center'}>
                    Drag and drop your CSV file here or browse file from your
                    computer.
                  </Box>
                </Box>

                <AppInput
                  type="file"
                  display="none"
                  onChange={handleFileSelect}
                  ref={inputRef}
                />
              </label>
              <Box className="download-template">
                <Link
                  as={ReactLink}
                  to={FILE_CSV_EXAMPLE}
                  target="_blank"
                  download
                  className="link"
                >
                  <Flex>
                    <DownloadIcon />
                    <Box ml={2}>Download Example</Box>
                  </Flex>
                </Link>
              </Box>
              {_renderNameFile()}
            </>
          )}
          {!!addressesValue && isNotCorrectAddress && (
            <Box className={'box-invalid'}>
              <Flex justifyContent="space-between">
                <Box>These are invalid addresses:</Box>
                <Box className="link" onClick={onClearAddressInvalid}>
                  Delete All Invalid
                </Box>
              </Flex>
              <Box className="table-valid-address">
                <Flex className="header-list">
                  <Box>Address</Box>
                  <Box>LINE</Box>
                </Flex>
                <>
                  {addressesInvalid.map(({ value, index }) => {
                    if (index === -1) {
                      return null;
                    }
                    return (
                      <Flex key={index} className="content-list">
                        <Box>{value || 'Unknown'}</Box>
                        <Box>{index + 1}</Box>
                      </Flex>
                    );
                  })}
                </>
              </Box>
            </Box>
          )}
        </AppField>
      </Flex>
    );
  };

  const _renderFormNFTActivity = () => {
    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'NFT Address'} customWidth={'49%'} isRequired>
          <AppInput
            size="lg"
            value={dataForm.address}
            onChange={(e) => {
              setDataForm({
                ...dataForm,
                address: e.target.value.trim(),
              });
            }}
            hiddenErrorText={type !== WEBHOOK_TYPES.NFT_ACTIVITY}
            validate={{
              name: `addressNft`,
              validator: validator.current,
              rule: 'required|isAddress',
            }}
          />
        </AppField>
        <AppField label={'Token ID'} customWidth={'49%'}>
          <AppInput
            size="lg"
            placeholder={'20,21,22'}
            value={dataForm.tokenIds}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                tokenIds: e.target.value,
              })
            }
            validate={{
              name: `tokenID`,
              validator: validator.current,
              rule: ['maxCountIds', 'isIds'],
            }}
          />
        </AppField>
        <AppUploadABI
          type={TYPE_ABI.NFT}
          onChange={(abi, abiFilter) =>
            setDataForm({ ...dataForm, abi, abiFilter })
          }
        />
      </Flex>
    );
  };

  const _renderFormWebhook = () => {
    if (type === WEBHOOK_TYPES.NFT_ACTIVITY) {
      return _renderFormNFTActivity();
    }

    if (type === WEBHOOK_TYPES.CONTRACT_ACTIVITY) {
      return _renderFormContractActivity();
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
              <Box className="icon-arrow-left" mr={6} />
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
                borderRightRadius={0}
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
