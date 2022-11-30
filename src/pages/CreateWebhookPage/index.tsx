import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
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

interface IDataForm {
  webhook: string;
  address: string;
  addresses: string;
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
    addresses: '',
  };

  const history = useHistory();
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [type, setType] = useState<string>(WEBHOOK_TYPES.NFT_ACTIVITY);
  const [isInsertManuallyAddress, setIsInsertManuallyAddress] =
    useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

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

    const data = {
      ...dataForm,
      type,
      tokenIds: dataForm.tokenIds
        .split(',')
        .filter((item: string) => !!item)
        .map((item: string) => +item.trim()),
      addresses: dataForm.addresses
        .split('\n')
        .filter((item: string) => !!item),
    };

    try {
      await rf.getRequest('RegistrationRequest').addRegistrations(appId, data);
      history.push(`/apps/${appId}`);
      toastSuccess({ message: 'Create Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const isDisabled = !validator.current.allValid();
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, type]);

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

  const _renderFormAddressActivity = () => {
    const onChange = (e: any) => {
      const value = e.target.value.split(new RegExp(/,|;|\n|\s/));
      setDataForm({ ...dataForm, addresses: value.join('\n') });
    };

    return (
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'Addresses'} customWidth={'100%'} isRequired>
          <Box
            className="link type-upload-address"
            cursor="pointer"
            onClick={() => setIsInsertManuallyAddress(!isInsertManuallyAddress)}
          >
            {!isInsertManuallyAddress ? 'Insert Manually' : 'Upload File'}
          </Box>
          {isInsertManuallyAddress ? (
            <AppTextarea
              rows={6}
              value={dataForm.addresses}
              onChange={onChange}
              validate={{
                name: `addresses`,
                validator: validator.current,
                rule: 'required',
              }}
            />
          ) : (
            <label>
              <Box className="box-upload">
                <Box className="icon-upload" mb={4} />
                <Box maxW={'365px'} textAlign={'center'}>
                  Drag and drop your CSV file here or browse file from your
                  computer.
                </Box>
              </Box>

              <AppInput type="file" display="none" />
            </label>
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
            value={dataForm.tokenIds}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                tokenIds: e.target.value,
              })
            }
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

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <AppLink to={`/apps/${appId}`}>
              <Box className="icon-arrow-left" mr={6} />
            </AppLink>
            <Box>Create Webhook</Box>
          </Flex>
        </Flex>
        <AppCard className={'form-create'}>
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField label={'Webhook Type'} customWidth={'49%'} isRequired>
              <AppSelect2
                className="select-type-webhook"
                size="large"
                options={optionsWebhookType}
                value={type}
                onChange={(value: string) => {
                  if (type === value) return;
                  setDataForm(initDataCreateWebHook);
                  validator.current.fields = [];
                  validator.current.hideMessages();
                  forceUpdate();
                  setType(value);
                }}
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
                onChange={(e) =>
                  setDataForm({
                    ...dataForm,
                    webhook: e.target.value.trim(),
                  })
                }
                validate={{
                  name: `webhook`,
                  validator: validator.current,
                  rule: ['required', 'url'],
                }}
              />
            </AppField>
          </Flex>

          {_renderFormWebhook()}

          <Flex justifyContent={'flex-end'}>
            <AppButton
              disabled={isDisableSubmit}
              onClick={handleSubmitForm}
              size={'md'}
              mt={5}
              px={8}
              py={3}
            >
              Create webhook
            </AppButton>
          </Flex>
        </AppCard>
      </>
    </BasePageContainer>
  );
};

export default CreateWebhook;
