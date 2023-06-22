import { AppField, AppInput, AppReadABI } from 'src/components';
import React, { FC, useState, useEffect, useRef } from 'react';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import _ from 'lodash';
import { Box } from '@chakra-ui/react';
import { IDataForm } from '../index';

interface PartFormContractAptosProps {
  dataForm: IDataForm;
  onChangeForm: (value: IDataForm) => void;
  validator: any;
}

const PartFormModuleActivityAptos: FC<PartFormContractAptosProps> = ({
  dataForm,
  onChangeForm,
  validator,
}) => {
  const inputRef = useRef(null);

  const [dataAddress, setDataAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payloadForm, setPayloadForm] = useState<IDataForm>(dataForm);

  const getABI = async (payload: any) => {
    try {
      const res = await rf
        .getRequest('AptosRequest')
        .getABI(payload.address, payload.moduleName);
      return res?.abi;
    } catch (error) {
      return null;
    }
  };

  const getDataAddress = async (addressValue: string) => {
    try {
      setIsLoading(true);
      const resourceAddress = await rf
        .getRequest('AptosRequest')
        .getModules(addressValue, '0x1::code::PackageRegistry');

      const data = await Promise.all(
        resourceAddress?.data?.packages?.map(async (item: any) => {
          const moduleItem = await Promise.all(
            (item?.modules || []).map(async (itemModule: any) => {
              const abiData = await getABI({
                address: addressValue,
                moduleName: itemModule?.name,
              });

              return {
                name: itemModule?.name,
                abi: abiData,
              };
            }),
          );

          return {
            name: item.name,
            modules: moduleItem,
          };
        }),
      );
      setDataAddress(data);
      setIsLoading(false);
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
      setIsLoading(false);
      setDataAddress(null);
    }
  };

  useEffect(() => {
    setPayloadForm(dataForm);
  }, [dataForm]);

  const debouncedOnChange = _.debounce((e) => {
    setPayloadForm({
      ...payloadForm,
      address: e.target.value.trim(),
    });
  }, 2000);

  useEffect(() => {
    if (payloadForm.address) {
      getDataAddress(payloadForm.address).then();
    }
    onChangeForm(payloadForm);
  }, [payloadForm.address]);

  const _renderABI = () => {
    if (dataAddress) {
      return (
        <Box>
          <AppReadABI
            onChangeForm={(data) => onChangeForm(data)}
            address={payloadForm.address}
            dataForm={payloadForm}
            dataAddress={dataAddress}
          />
        </Box>
      );
    }
  };

  return (
    <Box width={'100%'}>
      <AppField label={'Address ID'} customWidth={'100%'} isRequired>
        <AppInput
          defaultValue={payloadForm.address}
          ref={inputRef}
          onChange={(e) => {
            if (e.target.value.trim()) {
              setIsLoading(true);
            } else {
              setDataAddress(null);
              setPayloadForm({ ...payloadForm, address: '' });
              setIsLoading(false);
            }
            debouncedOnChange(e);
          }}
          validate={{
            name: `addressId`,
            validator: validator.current,
            rule: 'required',
          }}
        />
      </AppField>
      {!isLoading && !dataAddress && payloadForm.address && (
        <Box color={'#ee5d50'} fontSize={'14px'}>
          Address Invalid
        </Box>
      )}

      {isLoading ? <Box>Loading...</Box> : _renderABI()}
    </Box>
  );
};

export default PartFormModuleActivityAptos;
