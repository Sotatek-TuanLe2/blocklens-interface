import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppButton, AppCard, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import AppUploadABI, { TYPE_ABI } from 'src/components/AppUploadABI';
import { BasePageContainer } from 'src/layouts';
import { useHistory, useParams } from 'react-router';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import { isValidChecksumAddress } from 'ethereumjs-util';

interface IDataForm {
  webhook: string;
  address: string;
  tokenIds: string;
  abi: any[];
  abiFilter: any[];
}

const CreateWebhookNFTPage = () => {
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
    tokenIds: '',
    abi: [],
    abiFilter: [],
  };

  const history = useHistory();
  const { id: appId } = useParams<{ id: string }>();
  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
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

  const handleSubmitForm = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }

    const data = {
      ...dataForm,
      type: WEBHOOK_TYPES.NFT_ACTIVITY,
      tokenIds: dataForm.tokenIds
        .split(',')
        .filter((item: string) => !!item)
        .map((item: string) => +item.trim()),
    };

    try {
      await rf.getRequest('RegistrationRequest').addRegistrations(appId, data);
      history.push(`/app-detail/${appId}`);
      toastSuccess({ message: 'Add Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const isDisabled = !validator.current.allValid();
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, open]);

  return (
    <BasePageContainer>
      <Box>
        <Box mb={4} fontSize={'20px'}>
          Create Webhook NFT
        </Box>
        <AppCard>
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField
              label={'WEBHOOK URL'}
              customWidth={'100%'}
              isRequired
              note="The endpoint to send notifications to."
            >
              <AppInput
                placeholder="https://yourapp.com/webhook/data/12345"
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
            <AppField label={'NFT ADDRESSES'} customWidth={'49%'} isRequired>
              <AppInput
                placeholder="0xbb.."
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
            <AppField label={'TOKEN IDS'} customWidth={'49%'}>
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
              />
            </AppField>
            <AppUploadABI
              onChange={(abi, abiFilter) =>
                setDataForm({ ...dataForm, abi, abiFilter })
              }
              type={TYPE_ABI.NFT}
            />
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
        </AppCard>
      </Box>
    </BasePageContainer>
  );
};

export default CreateWebhookNFTPage;
