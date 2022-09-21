import { useRef, useState, useEffect } from 'react';
import React from 'react';
import {
  AppField,
  AppCard,
  AppInput,
  AppButton,
  AppSelect,
} from 'src/components';
import { Flex, Text, Heading } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';
import config from 'src/config';
import { IChain } from './FormCreateApp';

export const CHAINS = config.chains.map((chain: IChain) => {
  const networksClone = chain.networks.map(
    (network: { name: string; id: string; icon: string }) => {
      return { label: network.name, value: network.id, icon: network.icon };
    },
  );

  return {
    label: chain.name,
    value: chain.id,
    icon: chain.icon,
    networks: [...networksClone],
  };
});

interface IDataForm {
  chainId: string;
  network: string;
  url: string;
  addressNFT: string;
  tokenIDs: string;
}

const FormCreateWebHook = () => {
  const initDataCreateWebHook = {
    chainId: CHAINS[0].value,
    network: CHAINS[0].networks[0].value,
    url: '',
    addressNFT: '',
    tokenIDs: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateWebHook);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [chainSelected, setChainSelected] = useState<any>(CHAINS[0]);
  const [networkSelected, setNetworkSelected] = useState<any>(
    CHAINS[0].networks[0],
  );
  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.500'}>{message}</Text>,
    }),
  );
  const handleSubmitForm = async () => {
    const dataSubmit = {
      ...dataForm,
      chainId: chainSelected.value,
      network: networkSelected.value,
    };
    console.log('dataForm', dataForm);
  };

  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  return (
    <AppCard mt={5} maxW={'1240px'}>
      <Heading as="h3" size="lg" mb={5}>
        Create webhook
      </Heading>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <Flex
          width={['100%', '49%']}
          flexWrap={'wrap'}
          justifyContent={'space-between'}
        >
          <AppField label={'CHAIN'} customWidth={'48%'}>
            <AppSelect
              onChange={(e: any) => {
                setChainSelected(
                  CHAINS.find((chain) => chain.value === e.value),
                );
                setNetworkSelected(
                  CHAINS.find((chain) => chain.value === e.value)?.networks[0],
                );
              }}
              options={CHAINS}
              defaultValue={chainSelected}
            ></AppSelect>
          </AppField>

          <AppField label={'NETWORK'} customWidth={'48%'}>
            <AppSelect
              onChange={(e: any) => {
                setNetworkSelected(
                  chainSelected.networks.find(
                    (network: any) => network.value === e.value,
                  ),
                );
              }}
              options={chainSelected.networks}
              defaultValue={CHAINS[0].networks[0]}
              value={networkSelected}
            ></AppSelect>
          </AppField>
        </Flex>

        <AppField label={'WEBHOOK URL'} customWidth={'49%'}>
          <Flex>
            <AppInput
              placeholder="https://yourapp.com/webhook/data/12345"
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
              size={'lg'}
              textTransform={'uppercase'}
              backgroundColor={'green.500'}
              fontSize={'14px'}
              borderLeftRadius={0}
            >
              Test webhook
            </AppButton>
          </Flex>
        </AppField>
        <AppField label={'NFT ADDRESSES'} customWidth={'49%'}>
          <AppInput
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
        </AppField>
        <AppField label={'TOKEN IDS'} customWidth={'49%'}>
          <AppInput
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
        </AppField>
      </Flex>

      <Flex justifyContent={'flex-end'}>
        <AppButton
          disabled={isDisableSubmit}
          onClick={() => handleSubmitForm()}
          size={'lg'}
          textTransform={'uppercase'}
        >
          Create webhook
        </AppButton>
      </Flex>
    </AppCard>
  );
};

export default FormCreateWebHook;
