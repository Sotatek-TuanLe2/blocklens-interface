import { AppField, AppInput, AppReadABI, AppSelect2 } from 'src/components';
import React, {
  FC,
  useState,
  useEffect,
  useRef,
  useMemo,
  ChangeEvent,
} from 'react';
import rf from 'src/requests/RequestFactory';
import _ from 'lodash';
import { Box } from '@chakra-ui/react';
import { IDataForm } from '../index';
import { isValidAddressSUIAndAptos } from 'src/utils/utils-helper';
import { PackageType } from 'src/utils/utils-webhook';

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

  const onChangeModule = (module: string) => {
    setPayloadForm({
      ...payloadForm,
      metadata: {
        ...payloadForm.metadata,
        module,
      },
    });
  };

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

  const filteredModules = useMemo(() => {
    if (!dataAddress) return [];

    const filteredData = dataAddress.map((item: PackageType) => ({
      ...item,
      modules: item.modules.filter(
        (i: any) => i.name === payloadForm.metadata?.module,
      ),
    }));

    return filteredData.filter((item: PackageType) => item.modules.length > 0);
  }, [dataAddress, payloadForm.metadata?.module]);

  const _renderABI = () => {
    if (dataAddress) {
      return (
        <Box>
          <AppReadABI
            onChangeForm={(data) => onChangeForm(data)}
            address={payloadForm.metadata?.address || ''}
            dataForm={payloadForm}
            dataAddress={filteredModules || dataAddress}
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

  const getModuleNames = (data: PackageType[]) => {
    if (dataAddress) {
      const moduleOptions = data.flatMap((item) =>
        (item.modules || []).map((module) => ({
          label: module.name,
          value: module.name,
        })),
      );
      return moduleOptions;
    }
  };

  const moduleNames = useMemo(() => getModuleNames(dataAddress), [dataAddress]);

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
      <AppField label={'Module'} isRequired>
        <AppSelect2
          disabled={!dataAddress}
          className="select-module"
          size="large"
          options={moduleNames || []}
          value={payloadForm.metadata?.module || ''}
          onChange={onChangeModule}
          validate={{
            name: `module`,
            validator: validator.current,
            rule: 'required',
          }}
          isLoading={
            isValidAddressSUIAndAptos(payloadForm.metadata?.address || '') &&
            isLoading
          }
        />
      </AppField>

      <>{payloadForm.metadata?.module && _renderABI()}</>
    </Box>
  );
};

export default PartFormModuleActivityAptos;
