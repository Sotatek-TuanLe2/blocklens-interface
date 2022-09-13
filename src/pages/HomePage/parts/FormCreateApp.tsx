import { useRef, useState, useEffect } from 'react';
import React from 'react';
import Card from 'src/components/Card';
import Field from 'src/components/Field';
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
        <Field label={"NAME"} customWidth={'100%'}>
          <AppInput
            fontSize={'16px'}
            placeholder="Gavin"
            size="lg"
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
        </Field>
        <Field label={"CHAIN"} customWidth={'49%'}>
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
        </Field>

        <Field label={"NETWORK"} customWidth={'49%'}>
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
        </Field>
        <Field label={"DESCRIPTION"} customWidth={'100%'}>
          <AppTextarea
            fontSize={'16px'}
            placeholder="Gavin"
            size="lg"
            value={dataForm.description}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                description: e.target.value,
              })
            }
          />
        </Field>
      </Flex>

      <Flex justifyContent={'flex-end'}>
        <AppButton
          disabled={isDisableSubmit}
          onClick={() => console.log("dataForm", dataForm)}
          borderRadius={'4px'}
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
