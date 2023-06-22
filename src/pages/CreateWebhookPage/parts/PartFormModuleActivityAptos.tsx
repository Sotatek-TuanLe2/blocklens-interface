import { AppField, AppInput, AppReadABI } from 'src/components';
import React, { useCallback, FC, useState, useEffect } from 'react';
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
  const [dataAddress, setDataAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const debounceDropDown = useCallback(
    _.debounce((addressValue: string) => {
      if (!addressValue) {
        return;
      }

      getDataAddress(addressValue).then();
    }, 2000),
    [dataForm.metadata?.address],
  );

  useEffect(() => {
    if (!dataForm.metadata?.address) {
      setDataAddress(null);
    }
  }, [dataForm.metadata?.address]);

  const _renderABI = () => {
    if (dataAddress) {
      return (
        <Box>
          <AppReadABI
            onChangeForm={(data) => onChangeForm(data)}
            address={dataForm.metadata?.address || ''}
            dataForm={dataForm}
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
          value={dataForm.metadata?.address}
          onChange={(e) => {
            onChangeForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                address: e.target.value.trim(),
              },
            });
            if (!e.target.value.trim()) {
              setIsLoading(true);
            }
            debounceDropDown(e.target.value.trim());
          }}
          validate={{
            name: `addressId`,
            validator: validator.current,
            rule: 'required',
          }}
        />
      </AppField>

      {!isLoading && !dataAddress && dataForm.metadata?.address && (
        <Box color={'#ee5d50'} fontSize={'14px'}>
          Address Invalid
        </Box>
      )}

      {isLoading ? <Box>Loading...</Box> : _renderABI()}
    </Box>
  );
};

export default PartFormModuleActivityAptos;
