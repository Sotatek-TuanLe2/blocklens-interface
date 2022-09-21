import { Flex, Heading, Text } from '@chakra-ui/react';
import { Dispatch, useEffect, useRef, useState } from 'react';
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

interface IFormCreateApp {
  setSearchListApp: Dispatch<any>;
}
interface IDataForm {
  name: string;
  chainId: string;
  network: string;
  description: string;
}

const FormCreateApp: React.FC<IFormCreateApp> = ({ setSearchListApp }) => {
  const initDataCreateApp = {
    name: '',
    chainId: 'Ethereum',
    network: 'Testnet',

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

  const handleSubmitForm = async () => {
    await rf.getRequest('AppRequest').createApp(_.omitBy(dataForm, _.isEmpty));
    setSearchListApp((pre: any) => {
      return { ...pre };
    });
    return;
  };
  return (
    <AppCard maxW={'1240px'}>
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
            options={config.chains}
            defaultValue={config.chains[0]}
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
            options={config.networks}
            defaultValue={config.networks[0]}
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
            handleSubmitForm();
          }}
          size={'lg'}
          textTransform={'uppercase'}
        >
          Create app
        </AppButton>
      </Flex>
    </AppCard>
  );
};

export default FormCreateApp;
