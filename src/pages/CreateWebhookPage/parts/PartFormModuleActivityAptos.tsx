import { AppField, AppInput, AppReadABI } from 'src/components';
import React, { useCallback, FC, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import _ from 'lodash';
import { Box } from '@chakra-ui/react';
import { IDataForm } from '../index';

interface PartFormContractAptosProps {
  dataForm: IDataForm;
  onChangeForm: any;
}

const PartFormModuleActivityAptos: FC<PartFormContractAptosProps> = ({
  dataForm,
  onChangeForm,
}) => {
  const [dataAddress, setDataAddress] = useState<any>();

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
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const debounceDropDown = useCallback(
    _.debounce((addressValue: string) => getDataAddress(addressValue), 2000),
    [dataForm.address],
  );

  return (
    <Box width={'100%'}>
      <AppField label={'Contract Address'} customWidth={'100%'} isRequired>
        <AppInput
          value={dataForm.address}
          onChange={(e) => {
            onChangeForm({
              ...dataForm,
              address: e.target.value.trim(),
            });
            debounceDropDown(e.target.value.trim());
          }}
        />
      </AppField>

      <AppReadABI
        onChangeForm={(data) => onChangeForm(data)}
        address={dataForm.address}
        dataForm={dataForm}
        dataAddress={dataAddress}
      />
    </Box>
  );
};

export default PartFormModuleActivityAptos;
