import { Flex } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import AppUploadABI from 'src/components/AppUploadABI';
import React, { FC } from 'react';
import { IDataForm } from '../index';
import standardABI from 'src/abi';
import { ABI_TYPES } from 'src/utils/common';

interface IPartFormTokenActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  type: string;
  validator: any;
  isStandardERC?: boolean;
  setIsStandardERC?: any;
}

const PartFormTokenActivity: FC<IPartFormTokenActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
  isStandardERC,
  setIsStandardERC,
}) => {
  const onChangeDataForm = (abi: any[], abiFilter: any[]) => {
    if (!!abi.length) {
      setIsStandardERC(
        standardABI['erc20']
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
      <AppField label={'Token Address'} customWidth={'100%'} isRequired>
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
          hiddenErrorText={type !== WEBHOOK_TYPES.TOKEN_ACTIVITY}
          validate={{
            name: `tokenAddress`,
            validator: validator.current,
            rule: 'required|isAddress',
          }}
        />
      </AppField>
      <AppUploadABI
        type={TYPE_ABI.TOKEN}
        isStandardERC={isStandardERC}
        onChange={onChangeDataForm}
      />
    </Flex>
  );
};

export default PartFormTokenActivity;
