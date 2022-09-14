import { useRef, useState, useEffect } from 'react';
import React from 'react';
import Card from 'src/components/Card';
import AppField from 'src/components/AppField';
import AppInput from 'src/components/AppInput';
import {
  Flex,
  Text,
  Heading,
} from '@chakra-ui/react';
import AppTextarea from 'src/components/AppTextarea';
import AppSelect from 'src/components/AppSelect';
import AppButton from 'src/components/AppButton';
import { createValidator } from 'src/utils/utils-validator';

const chains = [
  {
    label: 'Ethereum',
    value: 'GOERLI_TESTNET',
    icon: '/images/eth.svg',
  },
  {
    label: 'Binance Smart Chain',
    value: 'BSC_TESTNET',
    icon: '/images/bnb.svg',
  },
  {
    label: 'Polygon',
    value: 'POLYGON_TESTNET',
    icon: '/images/polygon.svg',
  },
];

const networks = [
  {
    label: 'Testnet',
    value: 'TESTNET',
    icon: '/images/eth.svg',
  },
  {
    label: 'Mainnet',
    value: 'MAINNET',
    icon: '/images/eth.svg',
  },
];

interface IDataForm {
  name: string;
  chainId: string;
  network: string;
  description: string;
}

const FormCreateApp = () => {
  const initDataCreateApp = {
    name: '',
    chainId: '',
    network: '',
    description: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateApp);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <Card>
      <Heading as="h3" size="lg" mb={5}>
        Create app
      </Heading>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={"NAME"} customWidth={'100%'}>
          <AppInput
            placeholder="Gavin"
            value={dataForm.name}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                name: e.target.value,
              })
            }
            validate={{
              name: `name`,
              validator: validator.current,
              rule: 'required',
            }}
          />
        </AppField>
        <AppField label={"CHAIN"} customWidth={'49%'}>
          <AppSelect
            onChange={(e: any) => {
              setDataForm({
                ...dataForm,
                chainId: e.value,
              })
            }}
            options={chains}
            defaultValue={chains[0]}
          >
          </AppSelect>
        </AppField>

        <AppField label={"NETWORK"} customWidth={'49%'}>
          <AppSelect
            onChange={(e: any) => {
              setDataForm({
                ...dataForm,
                network: e.value,
              })
            }}
            options={networks}
            defaultValue={networks[0]}
          >
          </AppSelect>
        </AppField>
        <AppField label={"DESCRIPTION"} customWidth={'100%'}>
          <AppTextarea
            placeholder="Gavin"
            value={dataForm.description}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                description: e.target.value,
              })
            }
          />
        </AppField>
      </Flex>

      <Flex justifyContent={'flex-end'}>
        <AppButton
          disabled={isDisableSubmit}
          onClick={() => console.log("dataForm", dataForm)}
          size={'lg'}
          textTransform={'uppercase'}
        >
          Create app
        </AppButton>
      </Flex>
    </Card>
  );
};

export default FormCreateApp;
