import { useRef, useState, useEffect } from 'react';
import React, { FC } from 'react';
import { AppField, AppInput, AppButton } from 'src/components';
import { Flex, Text } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import { IAppInfo } from '../index';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

interface IDataForm {
  webhook: string;
  address: string;
}

interface IFormCreateContract {
  appInfo: IAppInfo;
  onClose: () => void;
  onReloadData: () => void;
}

const FormCreateContract: FC<IFormCreateContract> = ({
  appInfo,
  onClose,
  onReloadData,
}) => {
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
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
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'WEBHOOK URL'} customWidth={'100%'}>
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
        <AppField label={'ADDRESS'} customWidth={'100%'}>
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
              name: `address`,
              validator: validator.current,
              rule: 'required',
            }}
          />
        </AppField>
        <Flex alignItems={'center'}>
          <Text>ABI</Text>
          <AppButton
            onClick={() => console.log('dfdfdf')}
            size={'sm'}
            ml={10}
            textTransform={'uppercase'}
          >
            Upload
          </AppButton>
        </Flex>
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
    </>
  );
};

export default FormCreateContract;
