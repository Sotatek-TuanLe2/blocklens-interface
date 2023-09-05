import { Flex, Box, Text } from '@chakra-ui/react';
import { AppField, AppInput, TYPE_ABI } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import AppUploadABI from 'src/components/AppUploadABI';
import React, { FC, useEffect, useState } from 'react';
import { IDataForm } from '../index';
import rf from 'src/requests/RequestFactory';
import { isAddress } from 'ethers/lib/utils';

interface IPartFormContractActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  type: string;
  validator: any;
  isStandardERC?: boolean;
}

const PartFormContractActivity: FC<IPartFormContractActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
  isStandardERC,
}) => {
  const [dataContractABI, setDataContractABI] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getContractVerify = async (address: string) => {
    try {
      setIsLoading(true);
      const res = await rf
        .getRequest('RegistrationRequest')
        .getContractABI(address);

      if (res && res.result) {
        setDataContractABI(JSON.parse(res?.result));
        setIsLoading(false);
        return;
      }

      setDataContractABI([]);
      setIsLoading(false);
    } catch (e) {
      setDataContractABI([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataForm.metadata?.address && isAddress(dataForm?.metadata?.address)) {
      getContractVerify(dataForm.metadata?.address || '').then();
    }
  }, [dataForm.metadata?.address]);

  const _renderNotificationFilter = () => {
    if (!!dataContractABI.length) {
      return (
        <AppUploadABI
          type={TYPE_ABI.CONTRACT}
          isStandardERC={isStandardERC}
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
          abiContract={dataContractABI}
        />
      );
    }

    return <Text className="text-error">The Contract Address is invalid.</Text>;
  };

  return (
    <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
      <AppField label={'Contract Address'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm?.metadata?.address}
          onChange={(e) =>
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                address: e.target.value.trim(),
              },
            })
          }
          hiddenErrorText={type !== WEBHOOK_TYPES.CONTRACT_ACTIVITY}
          validate={{
            name: `contractAddress`,
            validator: validator.current,
            rule: 'required|isAddress',
          }}
        />
      </AppField>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : (
        isAddress(dataForm.metadata?.address || '') &&
        dataContractABI &&
        _renderNotificationFilter()
      )}
    </Flex>
  );
};

export default PartFormContractActivity;
