import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useRef, useState } from 'react';
import BaseModal from './BaseModal';
import { IAppInfo } from 'src/pages/AppDetail';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
const Validator = require('jsonschema').Validator;
const validateJson = new Validator();

interface IDataForm {
  webhook: string;
  address: string;
  tokenIds: string;
  abi: any;
}

interface ICreateNFTModal {
  open: boolean;
  onClose: () => void;
  appInfo: IAppInfo;
  onReloadData: () => void;
}

const ModalCreateWebhookNFT: FC<ICreateNFTModal> = ({
  open,
  onClose,
  appInfo,
  onReloadData,
}) => {
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
    tokenIds: '',
    abi: [],
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  const handleSubmitForm = async () => {
    try {
      await rf.getRequest('RegistrationRequest').addNFTActivity({
        appId: appInfo.appId,
        ...dataForm,
        tokenIds: dataForm.tokenIds
          .split(',')
          .map((item: string) => item.trim()),
      });
      toastSuccess({ message: 'Add Successfully!' });
      onReloadData();
      onClose();
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    const isDisabled =
      !validator.current.allValid() ||
      !Object.values(validator.current.fields).length;
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const handleFileSelect = (evt: any) => {
    const file = evt.target.files[0];
    if (file.type !== 'application/json') {
      toastError({ message: 'The ABI file must be json file type' });
      return;
    }

    const ABIInputType = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          indexed: { type: 'boolean' },
          components: { type: 'array' },
          internalType: { type: 'string' },
        },
        required: ['name', 'type'],
      },
    };

    const ABIOutInputType = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          components: { type: 'array' },
          internalType: { type: 'string' },
        },
        required: ['name', 'type'],
      },
    };

    const schema = {
      type: 'object',
      properties: {
        abi: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              anonymous: { type: 'boolean' },
              constant: { type: 'boolean' },
              inputs: ABIInputType,
              name: { type: 'string' },
              outputs: ABIOutInputType,
              payable: { type: 'boolean' },
              stateMutability: { type: 'string' },
              type: { type: 'string' },
              gas: { type: 'number' },
            },
            required: ['type'],
          },
        },
      },
    };

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      if (!validateJson.validate(JSON.parse(data), schema).valid) {
        toastError({ message: 'The ABI file must be correct format' });
        return;
      }
      setDataForm({ ...dataForm, abi: JSON.parse(data).abi });
    };
    reader.readAsText(file);
  };

  const onCloseModal = () => {
    onClose();
    setDataForm(initDataCreateWebHook);
    validator.current.visibleFields = [];
  };

  return (
    <BaseModal
      size="2xl"
      title="Create NFT Activity"
      isOpen={open}
      onClose={onCloseModal}
      textActionLeft="Create Webhook"
    >
      <Box flexDirection={'column'} pt={'20px'}>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'WEBHOOK URL'} customWidth={'100%'} isRequired>
            <AppInput
              placeholder="https://yourapp.com/webhook/data/12345"
              borderRightRadius={0}
              value={dataForm.webhook}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  webhook: e.target.value,
                })
              }
              validate={{
                name: `webhook`,
                validator: validator.current,
                rule: ['required', 'url'],
              }}
            />
          </AppField>
          <AppField label={'NFT ADDRESSES'} customWidth={'49%'} isRequired>
            <AppInput
              placeholder="0xbb.."
              size="lg"
              value={dataForm.address}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  address: e.target.value,
                })
              }
              validate={{
                name: `addressNft`,
                validator: validator.current,
                rule: 'required',
              }}
            />
          </AppField>
          <AppField label={'TOKEN IDS'} customWidth={'49%'} isRequired>
            <AppInput
              placeholder="12, 0xc"
              size="lg"
              value={dataForm.tokenIds}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  tokenIds: e.target.value,
                })
              }
              validate={{
                name: `tokenIds`,
                validator: validator.current,
                rule: 'required',
              }}
            />
          </AppField>
          <Box>
            <Flex alignItems={'center'}>
              <Text mr={6}>
                ABI
                <Text as={'span'} color={'red.500'}>
                  *
                </Text>
              </Text>
              <label>
                <Box
                  px={3}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  py={1}
                  bgColor={'blue.500'}
                  color={'white'}
                >
                  Upload
                </Box>
                <AppInput
                  type="file"
                  onChange={handleFileSelect}
                  display="none"
                />
              </label>
            </Flex>
          </Box>
        </Flex>

        <Flex justifyContent={'flex-end'}>
          <AppButton
            disabled={isDisableSubmit}
            onClick={() => handleSubmitForm()}
            size={'md'}
            mt={5}
            textTransform={'uppercase'}
          >
            Create webhook
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalCreateWebhookNFT;
