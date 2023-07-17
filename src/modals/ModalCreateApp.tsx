import { Box, Flex, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import {
  AppButton,
  AppField,
  AppInput,
  AppSelect2,
  AppTextarea,
} from 'src/components';
import config from 'src/config';
import rf from 'src/requests/RequestFactory';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import { createValidator } from 'src/utils/utils-validator';
import useUser from '../hooks/useUser';
import { getUserStats } from '../store/user';
import BaseModal from './BaseModal';

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

const CHAINS = Object.keys(config.chains).map((chainKey) => {
  const chain = config.chains[chainKey];
  const networksClone = Object.keys(chain.networks).map((networkKey) => {
    const network = chain.networks[networkKey];
    return { label: network.name, value: network.id, icon: network.icon };
  });

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
    chain: '',
    network: '',
    description: '',
  };

  const [dataForm, setDataForm] = useState<IDataForm>(initDataCreateApp);
  const [isDisableSubmit, setIsDisableSubmit] = useState<boolean>(true);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const { user } = useUser();
  const userStats = user?.getStats();

  const dispatch = useDispatch();

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
    const statusSubmitBtn = setTimeout(() => {
      const isDisabled = !validator.current.allValid();
      setIsDisableSubmit(isDisabled);
    }, 0);
    return () => clearTimeout(statusSubmitBtn);
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
        toastSuccess({ message: 'Create app successfully!' });
        dispatch(getUserStats());
        reloadData && reloadData();
        onCloseModal();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
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
      title="Create New Projects"
      description={
        !userStats?.totalApp
          ? `We suggest you create an app and start experiencing our service,
       which grants real-time notifications to various blockchains' activities!`
          : ''
      }
      isOpen={open}
      className="modal-create-app"
      isFullScreen={isMobile}
      onClose={onCloseModal}
    >
      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField label={'Project Name'} customWidth={'100%'} isRequired>
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
              placeholder="Write something about this project in 100 characters!"
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
          <Box width={isMobile ? '100%' : '49%'} zIndex={99}>
            <AppField label={'Chain'} customWidth={'100%'} isRequired>
              <AppSelect2
                size="large"
                onChange={(value: string) => {
                  setChainSelected(
                    CHAINS.find((chain) => chain.value === value),
                  );
                  setNetworkSelected(
                    CHAINS.find((chain) => chain.value === value)?.networks[0],
                  );
                }}
                options={CHAINS}
                value={chainSelected.value}
              />
            </AppField>
          </Box>

          <Box width={isMobile ? '100%' : '49%'}>
            <AppField label={'Network'} customWidth={'100%'} isRequired>
              <AppSelect2
                size="large"
                onChange={(value: string) => {
                  setNetworkSelected(
                    chainSelected.networks.find(
                      (network: any) => network.value === value,
                    ),
                  );
                }}
                options={chainSelected.networks}
                value={networkSelected.value}
              />
            </AppField>
          </Box>
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
