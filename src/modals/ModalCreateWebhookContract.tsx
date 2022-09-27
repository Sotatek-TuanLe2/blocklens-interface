import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useRef, useState } from 'react';
import BaseModal from './BaseModal';
import { IAppInfo } from 'src/pages/AppDetail';
import { AppButton, AppField, AppInput } from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import AppUploadABI from 'src/components/AppUploadABI';

interface IDataForm {
  webhook: string;
  address: string;
  abi: any;
}

interface ICreateNFTModal {
  open: boolean;
  onClose: () => void;
  appInfo: IAppInfo;
  onReloadData: () => void;
}

const ModalCreateWebhookContract: FC<ICreateNFTModal> = ({
  open,
  onClose,
  appInfo,
  onReloadData,
}) => {
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
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
      await rf.getRequest('RegistrationRequest').addContractActivity({
        appId: appInfo.appId,
        ...dataForm,
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

  const onCloseModal = () => {
    onClose();
    setDataForm(initDataCreateWebHook);
    validator.current.visibleFields = [];
  };

  return (
    <BaseModal
      size="2xl"
      title="Create Contract"
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
          <AppField label={'CONTRACT ADDRESS'} customWidth={'100%'} isRequired>
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
                name: `contractAddress`,
                validator: validator.current,
                rule: 'required',
              }}
            />
          </AppField>
          <AppUploadABI
            onChange={(value) => setDataForm({ ...dataForm, abi: value })}
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
      </Box>
    </BaseModal>
  );
};

export default ModalCreateWebhookContract;
