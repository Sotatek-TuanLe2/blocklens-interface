import { AppField, AppInput, AppReadABI } from 'src/components';
import React, { FC, useState, useEffect, useRef, ChangeEvent } from 'react';
import rf from 'src/requests/RequestFactory';
import _ from 'lodash';
import { Box } from '@chakra-ui/react';
import { IDataForm } from '../index';
import { isValidAddressSUIAndAptos } from 'src/utils/utils-helper';

interface PartFormContractAptosProps {
  dataForm: IDataForm;
  onChangeForm: (value: IDataForm) => void;
  validator: any;
}

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

export const getDataAddress = async (
  addressValue: string,
  setDataAddress: (data: any) => void,
  setIsLoading: (value: boolean) => void,
) => {
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
    console.error(e);
    setIsLoading(false);
    setDataAddress(null);
  }
};

const PartFormModuleActivityAptos: FC<PartFormContractAptosProps> = ({
  dataForm,
  onChangeForm,
  validator,
}) => {
  const inputRef = useRef(null);

  const [dataAddress, setDataAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payloadForm, setPayloadForm] = useState<IDataForm>(dataForm);

  useEffect(() => {
    setPayloadForm(dataForm);
  }, [dataForm]);

  const debouncedOnChange = _.debounce((e) => {
    setPayloadForm({
      ...payloadForm,
      metadata: {
        ...payloadForm.metadata,
        address: e.target.value.trim(),
      },
    });
  }, 2000);

  useEffect(() => {
    if (
      payloadForm.metadata?.address &&
      isValidAddressSUIAndAptos(payloadForm.metadata?.address)
    ) {
      getDataAddress(
        payloadForm.metadata?.address,
        setDataAddress,
        setIsLoading,
      ).then();
    } else {
      setDataAddress(null);
    }
    onChangeForm(payloadForm);
  }, [payloadForm.metadata?.address]);


  const _renderABI = () => {
    if (dataAddress) {
      return (
        <Box>
          <AppReadABI
            onChangeForm={(data) => onChangeForm(data)}
            address={payloadForm.metadata?.address || ''}
            dataForm={payloadForm}
            dataAddress={dataAddress}
          />
        </Box>
      );
    }
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    (inputRef.current as any).value = e.target.value.trim();

    if (
      !e.target.value.trim() ||
      !isValidAddressSUIAndAptos(e.target.value.trim())
    ) {
      setDataAddress(null);
      setPayloadForm({
        ...payloadForm,
        metadata: {
          ...payloadForm.metadata,
          address: '',
        },
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedOnChange(e);
  };

  return (
    <Box width={'100%'}>
      <AppField label={'Address'} customWidth={'100%'} isRequired>
        <AppInput
          defaultValue={payloadForm.metadata?.address?.trim()}
          ref={inputRef}
          onChange={(e) => onChangeInput(e)}
          validate={{
            name: `address`,
            validator: validator.current,
            rule: 'required|isAddressAptos',
          }}
        />
      </AppField>

      {!isLoading &&
        !dataAddress &&
        payloadForm.metadata?.address &&
        isValidAddressSUIAndAptos(payloadForm.metadata?.address) && (
          <Box color={'#ee5d50'} fontSize={'14px'}>
            Address Invalid
          </Box>
        )}

      {isValidAddressSUIAndAptos(payloadForm.metadata?.address || '') &&
      isLoading ? (
        <Box>Loading...</Box>
      ) : (
        _renderABI()
      )}
    </Box>
  );
};

export default PartFormModuleActivityAptos;
