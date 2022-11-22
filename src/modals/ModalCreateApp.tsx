import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import BaseModal from './BaseModal';
import {
  AppButton,
  AppField,
  AppInput,
  AppSelect,
  AppTextarea,
} from 'src/components';
import { createValidator } from 'src/utils/utils-validator';
import rf from 'src/requests/RequestFactory';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import config from 'src/config';
import _ from 'lodash';

interface IModalCreateApp {
  open: boolean;
  onClose: () => void;
  reloadData?: () => void;
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

const ModalCreateApp: FC<IModalCreateApp> = ({ open, onClose, reloadData }) => {
  const initDataCreateApp = {
    name: '',
    chain: CHAINS[0].value,
    network: CHAINS[0].networks[0].value,
    description: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateApp);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

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
    setTimeout(() => {
      const isDisabled = !validator.current.allValid();
      setIsDisableSubmit(isDisabled);
    }, 0);
  }, [dataForm, open]);

  const handleSubmitForm = async () => {
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return forceUpdate();
    }

    const dataSubmit = {
      name: dataForm.name.trim(),
      description: dataForm.description.trim(),
      chain: chainSelected.value,
      network: networkSelected.value,
    };
    try {
      const res = await rf
        .getRequest('AppRequest')
        .createApp(_.omitBy(dataSubmit, _.isEmpty));
      if (res.key) {
        setDataForm({ ...initDataCreateApp });
        toastSuccess({ message: 'Create app success!' });
        reloadData && reloadData();
        onCloseModal();
      }
    } catch (e: any) {
      toastError({ message: e?.message || 'Oops. Something went wrong!' });
    }
  };

  const onCloseModal = () => {
    onClose();
    validator.current.visibleFields = [];
    setDataForm(initDataCreateApp);
  };

  return (
    <BaseModal
      size="lg"
      title="Create an Apps"
      description="We suggest you create an App and start experiencing our BlockLens API,
       which grants access to various blockchains WITHOUT running nodes anymore!"
      isOpen={open}
      onClose={onCloseModal}
    >
      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'App Name'} customWidth={'100%'} isRequired>
            <AppInput
              placeholder="Gavin"
              value={dataForm.name}
              onChange={(e) => {
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
          <AppField label={'Description'} customWidth={'100%'}>
            <AppTextarea
              placeholder="Write something about this app in 100 characters!"
              value={dataForm.description}
              onChange={(e) => {
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
          <AppField label={'Chain'} customWidth={'49%'} isRequired>
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
            />
          </AppField>

          <AppField label={'Network'} customWidth={'49%'} isRequired>
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
            />
          </AppField>
        </Flex>

        <Flex flexWrap={'wrap'} justifyContent={'space-between'} mt={4}>
          <AppButton
            width={'49%'}
            size={'lg'}
            variant={'cancel'}
            onClick={onCloseModal}
          >
            Cancel
          </AppButton>
          <AppButton
            width={'49%'}
            size={'lg'}
            isDisabled={isDisableSubmit}
            onClick={handleSubmitForm}
          >
            Next
          </AppButton>
        </Flex>
      </Box>
    </BaseModal>
  );
};

export default ModalCreateApp;
