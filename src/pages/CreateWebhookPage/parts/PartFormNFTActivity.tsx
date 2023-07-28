import { Flex } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import AppUploadABI from 'src/components/AppUploadABI';
import React, { FC } from 'react';
import { IDataForm } from '../index';

interface IPartFormNFTActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  type: string;
  validator: any;
  isCreateWithoutProject?: boolean;
}

const PartFormNFTActivity: FC<IPartFormNFTActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
  isCreateWithoutProject,
}) => {
  return (
    <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
      <AppField
        label={
          isCreateWithoutProject
            ? 'Collection’s Contract Address'
            : 'NFT Address'
        }
        customWidth={isCreateWithoutProject ? '100%' : '49%'}
        isRequired
      >
        <AppInput
          size="lg"
          value={dataForm.metadata?.address}
          onChange={(e) => {
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                address: e.target.value.trim(),
              },
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
      <AppField
        label={'Token ID'}
        customWidth={isCreateWithoutProject ? '100%' : '49%'}
      >
        <AppInput
          size="lg"
          placeholder={'20,21,22'}
          value={dataForm.metadata?.tokenIds}
          onChange={(e) =>
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                tokenIds: e.target.value.trim(),
              },
            })
          }
          validate={{
            name: `tokenID`,
            validator: validator.current,
            rule: 'isIds|maxCountIds'
          }}
        />
      </AppField>
      <AppUploadABI
        type={TYPE_ABI.NFT}
        onChange={(abi, abiFilter) =>
          setDataForm({
            ...dataForm,
            metadata: {
              ...dataForm.metadata,
              abi,
              abiFilter,
            },
          })
        }
      />
    </Flex>
  );
};

export default PartFormNFTActivity;
