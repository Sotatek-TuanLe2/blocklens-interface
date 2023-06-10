import { AppInput } from 'src/components';
import React, { useEffect, useCallback, useState, FC } from 'react';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import _ from 'lodash';

interface PartFormContractAptosProps {
  onFetchData?: (data: any) => void;
}

const PartFormContractAptos: FC<PartFormContractAptosProps> = ({
  onFetchData,
}) => {
  const [address, setAddress] = useState<string>('');

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

      onFetchData && onFetchData(data);
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const debounceDropDown = useCallback(
    _.debounce((addressValue: string) => getDataAddress(addressValue), 2000),
    [],
  );

  return (
    <div>
      <AppInput
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          debounceDropDown(e.target.value.trim());
        }}
      />
    </div>
  );
};

export default PartFormContractAptos;
