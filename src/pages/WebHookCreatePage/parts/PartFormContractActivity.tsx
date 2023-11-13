import { Flex, Box, Text } from '@chakra-ui/react';
import { AppField, AppInput } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import AppUploadABI from 'src/components/AppUploadABI';
import React, { FC, useEffect, useState } from 'react';
import { IDataForm } from '../index';
import rf from 'src/requests/RequestFactory';
import SimpleReactValidator from 'simple-react-validator';

interface IPartFormContractActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  type: string;
  validator: React.MutableRefObject<SimpleReactValidator>;
  chain: string;
  network: string;
}

const PartFormContractActivity: FC<IPartFormContractActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
  chain,
  network,
}) => {
  const [dataContractABI, setDataContractABI] = useState<any>(null);
  const [isContractVerified, setContractVerified] = useState<boolean>(false);
  const [isValidContractAddress, setIsValidContractAddress] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getContractVerify = async (address: string) => {
    try {
      setIsLoading(true);
      const res = await rf
        .getRequest('RegistrationRequest')
        .getContractABI(address, chain, network);

      if (res) {
        if (res.message === 'NOTOK') {
          setDataContractABI([]);
          setContractVerified(false);
        } else {
          setContractVerified(true);
          setDataContractABI(JSON.parse(res?.result));
        }

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
    if (validator.current.fieldValid('contractAddress')) {
      getContractVerify(dataForm.metadata?.address || '').then();
    }
    setIsValidContractAddress(validator.current.fieldValid('contractAddress'));
  }, [dataForm.metadata?.address]);

  const _renderNotificationFilter = () => {
    if (!isContractVerified) {
      return (
        <Text className="text-error">The Contract Address is not verified</Text>
      );
    }

    if (!dataContractABI.length) {
      return null;
    }

    return (
      <AppUploadABI
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
        isValidContractAddress && dataContractABI && _renderNotificationFilter()
      )}
    </Flex>
  );
};

export default PartFormContractActivity;
