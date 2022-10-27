import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppButton, AppField, AppInput, AppCard } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import AppUploadABI from 'src/components/AppUploadABI';
import { useHistory, useParams } from 'react-router';
import { BasePageContainer } from 'src/layouts';

interface IDataForm {
  webhook: string;
  address: string;
  abi: any[];
  abiFilter: any[];
}

const CreateWebhookContractPage = () => {
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
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

    try {
      await rf.getRequest('RegistrationRequest').addContractActivity({
        appId: +appId,
        ...dataForm,
      });
      history.push(`/app-detail/${appId}`);
      toastSuccess({ message: 'Add Successfully!' });
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const isDisabled = !validator.current.allValid() || !dataForm.abi.length;
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, open]);

  return (
    <BasePageContainer>
      <Box>
        <Box mb={4} fontSize={'20px'}>
          Create Webhook Contract
        </Box>

        <AppCard>
          <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
            <AppField label={'WEBHOOK URL'} customWidth={'49%'} isRequired>
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
            <AppField label={'CONTRACT ADDRESS'} customWidth={'49%'} isRequired>
              <AppInput
                placeholder="0xbb.."
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
                  rule: 'required',
                }}
              />
            </AppField>
            <AppUploadABI
              onChange={(abi, abiFilter) =>
                setDataForm({ ...dataForm, abi, abiFilter })
              }
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

export default CreateWebhookContractPage;
