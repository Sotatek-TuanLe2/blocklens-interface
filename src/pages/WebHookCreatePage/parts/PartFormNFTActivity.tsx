import { Flex } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import AppUploadABI from 'src/components/AppUploadABI';
import React, { FC } from 'react';
import { IDataForm } from '../index';
import standardABI from 'src/abi';
import { ABI_TYPES } from 'src/utils/common';

interface IPartFormNFTActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  type: string;
  validator: any;
  isCreateWithoutProject?: boolean;
  isStandardERC?: boolean;
  setIsStandardERC?: any;
}

const PartFormNFTActivity: FC<IPartFormNFTActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
  isCreateWithoutProject,
  isStandardERC,
  setIsStandardERC,
}) => {
  const onChangeDataForm = (abi: any[], abiFilter: any[]) => {
    if (!!abi.length) {
      setIsStandardERC(
        standardABI['ERC-721']
          .filter(
            (value: any) =>
              value.type === ABI_TYPES.EVENT ||
              (value.type === ABI_TYPES.FUNCTION &&
                value.stateMutability !== 'view'),
          )
          .every((value: any) => abi.some((item) => item.name === value.name)),
      );
    }
    setDataForm({
      ...dataForm,
      metadata: {
        ...dataForm.metadata,
        abi,
        abiFilter,
      },
    });
  };

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
            rule: 'isIds|maxCountIds',
          }}
        />
      </AppField>
      <AppUploadABI
        type={TYPE_ABI.NFT}
        isStandardERC={isStandardERC}
        onChange={onChangeDataForm}
      />
    </Flex>
  );
};

export default PartFormNFTActivity;
