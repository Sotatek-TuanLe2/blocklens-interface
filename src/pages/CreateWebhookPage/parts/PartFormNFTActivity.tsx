import { Flex } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import AppUploadABI from 'src/components/AppUploadABI';
import React, { FC } from 'react';
import { IDataForm } from '../index';

interface IPartFormNFTActivity {
  dataForm: IDataForm;
  setDataForm: (value: IDataForm) => void;
  type: string;
  validator: any;
}

const PartFormNFTActivity: FC<IPartFormNFTActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
}) => {
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

export default PartFormNFTActivity;