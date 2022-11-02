import { Flex, Text } from '@chakra-ui/react';
import React, { Dispatch, useEffect, useRef, useState } from 'react';
import {
  AppButton,
  AppCard,
  AppField,
  AppInput,
  AppSelect,
  AppTextarea,
} from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import _ from 'lodash';
import config from 'src/config';
import { toastSuccess } from 'src/utils/utils-notify';

interface IFormCreateApp {
  setSearchListApp: Dispatch<any>;
}
interface IDataForm {
  name: string;
  chain: string;
  network: string;
  description: string;
}

export interface IChain {
  name: string;
  id: string;
  icon: string;
  networks: { name: string; id: string; icon: string }[];
}

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

const FormCreateApp: React.FC<IFormCreateApp> = ({ setSearchListApp }) => {
  const initDataCreateApp = {
    name: '',
    chain: CHAINS[0].value,
    network: CHAINS[0].networks[0].value,
    description: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateApp);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [hiddenErrorText, setHiddenErrorText] = useState(false);
  const validator = useRef(
    createValidator({
      element: (message: string) => (
        <Text className="text-error">{message}</Text>
      ),
    }),
  );
  const [chainSelected, setChainSelected] = useState<any>(CHAINS[0]);
  const [networkSelected, setNetworkSelected] = useState<any>(
    CHAINS[0].networks[0],
  );
  useEffect(() => {
    const isDisabled = !validator.current.allValid();
    setIsDisableSubmit(isDisabled);
  }, [dataForm]);

  const handleSubmitForm = async () => {
    const dataSubmit = {
      name: dataForm.name.trim(),
      description: dataForm.description.trim(),
      chain: chainSelected.value,
      network: networkSelected.value,
    };
    setHiddenErrorText(true);
    const res = await rf
      .getRequest('AppRequest')
      .createApp(_.omitBy(dataSubmit, _.isEmpty));
    if (res.key) {
      setDataForm({ ...initDataCreateApp });
      toastSuccess({ message: 'Create app success!' });
      setSearchListApp((pre: any) => {
        return { ...pre };
      });
    }
    return;
  };
  return (
    <AppCard maxW={'1240px'}>
      <Text fontSize={'24px'} mb={4}>
        Create App
      </Text>
      <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
        <AppField label={'NAME'} customWidth={'100%'} isRequired>
          <AppInput
            placeholder="Gavin"
            value={dataForm.name}
            hiddenErrorText={hiddenErrorText}
            onChange={(e) => {
              setHiddenErrorText(false);
              setDataForm({
                ...dataForm,
                name: e.target.value,
              });
            }}
            validate={{
              name: `name`,
              validator: validator.current,
              rule: ['required', 'max:20'],
            }}
          />
        </AppField>
        <AppField label={'CHAIN'} customWidth={'49%'} isRequired>
          <AppSelect
            onChange={(e: any) => {
              setChainSelected(CHAINS.find((chain) => chain.value === e.value));
              setNetworkSelected(
                CHAINS.find((chain) => chain.value === e.value)?.networks[0],
              );
            }}
            options={CHAINS}
            defaultValue={chainSelected}
          ></AppSelect>
        </AppField>

        <AppField label={'NETWORK'} customWidth={'49%'} isRequired>
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
        <AppField label={'DESCRIPTION'} customWidth={'100%'}>
          <AppTextarea
            hiddenErrorText={hiddenErrorText}
            placeholder="Write something about this app in 50 characters!"
            value={dataForm.description}
            onChange={(e) => {
              setHiddenErrorText(false);
              setDataForm({
                ...dataForm,
                description: e.target.value,
              });
            }}
            validate={{
              name: 'description',
              validator: validator.current,
              rule: ['max:100'],
            }}
          />
        </AppField>
      </Flex>
      <Flex justifyContent={'flex-end'}>
        <AppButton
          disabled={isDisableSubmit}
          onClick={handleSubmitForm}
          size={'md'}
          textTransform={'uppercase'}
        >
          Create app
        </AppButton>
      </Flex>
    </AppCard>
  );
};

export default FormCreateApp;
