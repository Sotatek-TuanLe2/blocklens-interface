import { useRef, useState, useEffect } from 'react';
import React from 'react';
import Card from 'src/components/Card';
import Field from 'src/components/Field';
import AppInput from 'src/components/AppInput';
import { Flex, Text, Heading } from '@chakra-ui/react';
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
  chainId: string;
  network: string;
  url: string;
  addressNFT: string;
  tokenIDs: string;
}

const FormCreateWebHook = () => {
  const initDataCreateWebHook = {
    chainId: '',
    network: '',
    url: '',
    addressNFT: '',
    tokenIDs: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
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
        Create webhook
      </Heading>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <Flex width={['100%', '49%']} flexWrap={'wrap'} justifyContent={'space-between'}>
          <Field label={'CHAIN'} customWidth={'48%'}>
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

          <Field label={'NETWORK'} customWidth={'48%'}>
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
        </Flex>

        <Field label={'WEBHOOK URL'} customWidth={'49%'}>
          <Flex>
            <AppInput
              fontSize={'16px'}
              placeholder="https://yourapp.com/webhook/data/12345"
              size="lg"
              borderRightRadius={0}
              value={dataForm.url}
              onChange={(e) =>
                setDataForm({
                  ...dataForm,
                  url: e.target.value,
                })
              }
            />
            <AppButton
              onClick={() => console.log('test')}
              borderRadius={'4px'}
              size={'lg'}
              textTransform={'uppercase'}
              backgroundColor={'green.500'}
              fontSize={'14px'}
              borderLeftRadius={0}
            >
              Test webhook
            </AppButton>
          </Flex>
        </Field>
        <Field label={'NFT ADDRESSES'} customWidth={'49%'}>
          <AppInput
            fontSize={'16px'}
            placeholder="0xbb.."
            size="lg"
            value={dataForm.addressNFT}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                addressNFT: e.target.value,
              })
            }
            validate={{
              name: `addressNft`,
              validator: validator.current,
              rule: 'required',
            }}
          />
        </Field>
        <Field label={'TOKEN IDS'} customWidth={'49%'}>
          <AppInput
            fontSize={'16px'}
            placeholder="12 or 0xc"
            size="lg"
            value={dataForm.tokenIDs}
            onChange={(e) =>
              setDataForm({
                ...dataForm,
                tokenIDs: e.target.value,
              })
            }
            validate={{
              name: `tokenIds`,
              validator: validator.current,
              rule: 'required',
            }}
          />
        </Field>
      </Flex>

      <Flex justifyContent={'flex-end'}>
        <AppButton
          disabled={isDisableSubmit}
          onClick={() => console.log('dataForm', dataForm)}
          borderRadius={'4px'}
          size={'lg'}
          textTransform={'uppercase'}
        >
          Create webhook
        </AppButton>
      </Flex>
    </Card>
  );
};

export default FormCreateWebHook;
