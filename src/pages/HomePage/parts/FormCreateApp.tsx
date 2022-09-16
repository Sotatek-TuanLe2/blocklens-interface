import { useRef, useState, useEffect } from 'react';
import React from 'react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppSelect,
  AppTextarea,
} from 'src/components';
import { Flex, Text, Heading, Box, Divider } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import BaseModal from 'src/modals/BaseModal';
import { copyToClipboard } from 'src/utils/utils-helper';

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
  const [isOpen, setIsOpen] = useState<boolean>(true);
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

  const _renderModalConnectBlockLens = () => {
    return (
      <BaseModal
        size="2xl"
        title="Connect to Blocklens"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onActionLeft={() => {
          console.log('Learn More');
        }}
        textActionLeft="LEARN MORE"
        styleHeader={{ bgColor: 'blue.200', color: 'White', paddingY: '20px' }}
      >
        <Box flexDirection={'column'} pt={'20px'}>
          <AppField label={'API KEY'}>
            <AppInput
              isDisabled
              endAdornment={
                <Box
                  onClick={() => copyToClipboard('copy')}
                  flexDirection={'row'}
                  display="flex"
                  mr={'33px'}
                  cursor={'pointer'}
                >
                  {' '}
                  <div className="icon-copy_blue" />{' '}
                  <Text color={'blue.100'} pl={'3px'} fontSize={'12px'}>
                    Copy
                  </Text>
                </Box>
              }
            />
          </AppField>
          <AppField label={'HTTPS'}>
            <AppInput
              isDisabled
              endAdornment={
                <Box
                  onClick={() => copyToClipboard('copy')}
                  flexDirection={'row'}
                  display="flex"
                  mr={'33px'}
                  cursor={'pointer'}
                >
                  {' '}
                  <div className="icon-copy_blue" />{' '}
                  <Text color={'blue.100'} pl={'3px'} fontSize={'12px'}>
                    Copy
                  </Text>
                </Box>
              }
            />
          </AppField>
          <AppField label={'WEBSOKECTS'}>
            <AppInput
              isDisabled
              endAdornment={
                <Box
                  onClick={() => copyToClipboard('copy')}
                  cursor={'pointer'}
                  flexDirection={'row'}
                  display="flex"
                  mr={'33px'}
                >
                  {' '}
                  <div className="icon-copy_blue" />{' '}
                  <Text color={'blue.100'} pl={'3px'} fontSize={'12px'}>
                    Copy
                  </Text>
                </Box>
              }
            />
          </AppField>
          <Divider />
        </Box>
      </BaseModal>
    );
  };

  return (
    <AppCard>
      <Heading as="h3" size="lg" mb={5}>
        Create app
      </Heading>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'NAME'} customWidth={'100%'}>
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
        <AppField label={'CHAIN'} customWidth={'49%'}>
          <AppSelect
            onChange={(e: any) => {
              setDataForm({
                ...dataForm,
                chainId: e.value,
              });
            }}
            options={chains}
            defaultValue={chains[0]}
          ></AppSelect>
        </AppField>

        <AppField label={'NETWORK'} customWidth={'49%'}>
          <AppSelect
            onChange={(e: any) => {
              setDataForm({
                ...dataForm,
                network: e.value,
              });
            }}
            options={networks}
            defaultValue={networks[0]}
          ></AppSelect>
        </AppField>
        <AppField label={'DESCRIPTION'} customWidth={'100%'}>
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
          onClick={() => {
            console.log('dataForm', dataForm);
          }}
          size={'lg'}
          textTransform={'uppercase'}
        >
          Create app
        </AppButton>
      </Flex>
      {isOpen && _renderModalConnectBlockLens()}
    </AppCard>
  );
};

export default FormCreateApp;
