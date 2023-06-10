import { AppField, AppInput } from 'src/components';
import React, { useEffect, useCallback, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';
import { getErrorMessage } from 'src/utils/utils-helper';
import _ from 'lodash';

const PartFormAddressAptos = () => {
  const [address, setAddress] = useState<string>('');
  const [dataAddress, setDataAddress] = useState<any>([]);

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

      if (!resourceAddress?.data || !resourceAddress?.data?.packages) {
        setDataAddress([]);
      }

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
    [],
  );

  return (
    <div>
      <AppField label={'Address'} customWidth={'100%'} isRequired>
        <AppInput
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            debounceDropDown(e.target.value.trim());
          }}
          // validate={{
          //   name: `address`,
          //   validator: validator.current,
          //   rule: ['required'],
          // }}
        />
      </AppField>
    </div>
  );
};

export default PartFormAddressAptos;
