import { useRef, useState, useEffect } from 'react';
import React, { FC } from 'react';
import { AppField, AppInput, AppButton } from 'src/components';
import { Flex, Text, Box } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import { IAppInfo } from '../index';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

interface IDataForm {
  webhook: string;
  address: string;
  tokenIds: string;
}

interface IFormCreateNFT {
  appInfo: IAppInfo;
  onClose: () => void;
  onReloadData: () => void;
}

const FormCreateNFT: FC<IFormCreateNFT> = ({
  appInfo,
  onClose,
  onReloadData,
}) => {
  const initDataCreateWebHook = {
    webhook: '',
    address: '',
    tokenIds: '',
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
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const handleFileSelect = (evt: any) => {
    const files = evt.target.files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function (e: any) {
      console.log(e.target.result, 'data');
    };
    reader.readAsText(file);
  };

  return (
    <>
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
        <Flex alignItems={'center'}>
          <Text mr={10}>ABI</Text>
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
            <AppInput type="file" onChange={handleFileSelect} display="none" />
          </label>
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

export default FormCreateNFT;
