import { Box, Flex, Link } from '@chakra-ui/react';
import { AppField, AppInput, AppTextarea } from 'src/components';
import { WEBHOOK_TYPES } from 'src/utils/utils-webhook';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { IDataForm } from '../../WebHookCreatePage';
import { toastError } from 'src/utils/utils-notify';
import { CloseIcon } from '@chakra-ui/icons';
import { Link as ReactLink } from 'react-router-dom';
import { DownloadIcon } from 'src/assets/icons';
import { isEVMNetwork } from 'src/utils/utils-network';
import {
  isValidAddressEVM,
  isValidAddressSUIAndAptos,
} from 'src/utils/utils-helper';

interface IPartFormAddressActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  type: string;
  validator: any;
  chain: string;
}

const PartFormAddressActivity: FC<IPartFormAddressActivity> = ({
  dataForm,
  setDataForm,
  type,
  validator,
  chain,
}) => {
  const [fileSelected, setFileSelected] = useState<any>({});
  const [addressesValue, setAddressesValue] = useState<string>('');
  const [isInsertManuallyAddress, setIsInsertManuallyAddress] =
    useState<boolean>(true);
  const inputRef = useRef<any>(null);
  const FILE_CSV_EXAMPLE = `/abi/Address_Example_${chain}.csv`;

  const addressesInput = useMemo(() => {
    return addressesValue.split('\n');
  }, [addressesValue]);

  const isValidAddress = (address: string) => {
    if (isEVMNetwork(chain)) return isValidAddressEVM(address);
    return isValidAddressSUIAndAptos(address);
  };

  const addressesInvalid = useMemo(() => {
    return addressesInput.map((address: string, index: number) => ({
      value: address,
      index: !isValidAddress(address) ? index : -1,
    }));
  }, [addressesInput]);

  const isNotCorrectAddress = useMemo(
    () => addressesInvalid.some(({ index }) => index > -1),
    [addressesInvalid],
  );

  const addressValid = useMemo(() => {
    return addressesInput.filter((address: string) => isValidAddress(address));
  }, [addressesInput]);

  useEffect(() => {
    onClearFile();
    setAddressesValue('');
    setDataForm({
      ...dataForm,
      metadata: {
        ...dataForm.metadata,
        addresses: [],
      },
    });
  }, [chain]);

  useEffect(() => {
    if (
      !addressesInvalid ||
      !addressesInvalid.length ||
      addressesInvalid.every((item) => item.index === -1)
    ) {
      setDataForm({
        ...dataForm,
        metadata: {
          ...dataForm.metadata,
          addresses: addressValid,
        },
      });
    } else {
      setDataForm({
        ...dataForm,
        metadata: {
          ...dataForm.metadata,
          addresses: [],
        },
      });
    }
  }, [addressesInput, addressesInvalid]);

  const onClearFile = () => {
    if (!isInsertManuallyAddress) {
      setFileSelected({});
      inputRef.current.value = null;
      setAddressesValue('');
      setDataForm({
        ...dataForm,
        metadata: {
          ...dataForm.metadata,
          addresses: [],
        },
      });
    }
  };

  const onClearAddressInvalid = () => {
    setDataForm({
      ...dataForm,
      metadata: {
        ...dataForm.metadata,
        addresses: addressValid,
      },
    });
    setAddressesValue(addressValid.join('\n'));
  };

  const onChangeAddresses = (e: any) => {
    const value = e.target.value.split(new RegExp(/,|;|\n|\s/));
    setAddressesValue(value.join('\n'));
  };

  const handleFileSelect = (evt: any, dropFile?: any) => {
    const file = dropFile || evt.target.files[0];
    if (file.type !== 'text/csv') {
      toastError({ message: 'The file must be csv file type' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const dataFormat = data?.split('\n').filter((item: string) => !!item);
      const uploadedAddresses = dataFormat
        .map((item: string) => item.replace('\r', ''))
        .join('\n');
      if (!uploadedAddresses) {
        toastError({ message: 'The Addresses file must be correct format' });
        return;
      }
      setAddressesValue(uploadedAddresses);
      setFileSelected(dropFile || evt.target.files[0]);
    };

    reader.readAsText(file);
  };

  const _renderNameFile = () => {
    if (fileSelected?.name) {
      return (
        <>
          <Box className="file-name">
            {fileSelected?.name}
            <CloseIcon onClick={onClearFile} className={'icon-clear'} ml={3} />
          </Box>
          <AppTextarea rows={6} isDisabled={true} value={addressesValue} />
        </>
      );
    }
  };

  const onDropHandler = (ev: any) => {
    ev.preventDefault();

    let file: any = {};
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      file = [...ev.dataTransfer.items]
        .find((item: any) => item.kind === 'file')
        .getAsFile();
    } else {
      // Use DataTransfer interface to access the file(s)
      file = ev.dataTransfer.files[0];
    }
    handleFileSelect(null, file);
  };

  const onDragOver = (e: any) => e.preventDefault();

  return (
    <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
      <AppField label={`${chain} Addresses`} customWidth={'100%'} isRequired>
        <Box
          className="link type-upload-address"
          cursor="pointer"
          onClick={() => {
            setIsInsertManuallyAddress(!isInsertManuallyAddress);
            setDataForm({
              ...dataForm,
              metadata: {
                ...dataForm.metadata,
                addresses: [],
              },
            });
            setAddressesValue('');
            validator.current.fields = [];
            // forceUpdate();
            onClearFile();
          }}
        >
          {!isInsertManuallyAddress ? 'Insert Manually' : 'Upload File'}
        </Box>
        {isInsertManuallyAddress ? (
          <>
            <AppTextarea
              rows={6}
              value={addressesValue}
              onChange={onChangeAddresses}
              hiddenErrorText={type !== WEBHOOK_TYPES.ADDRESS_ACTIVITY}
              validate={{
                name: `addresses`,
                validator: validator.current,
                rule: 'required',
              }}
            />
          </>
        ) : (
          <>
            <label onDrop={onDropHandler} onDragOver={onDragOver}>
              <Box className="box-upload">
                <Box className="icon-upload" mb={4} />
                <Box maxW={'365px'} textAlign={'center'}>
                  Drag and drop your CSV file here or browse file from your
                  computer.
                </Box>
              </Box>

              <AppInput
                type="file"
                display="none"
                onChange={handleFileSelect}
                ref={inputRef}
              />
            </label>
            <Box className="download-template">
              <Link
                as={ReactLink}
                to={FILE_CSV_EXAMPLE}
                target="_blank"
                download
              >
                <Flex>
                  <DownloadIcon color={'#0060db'} />
                  <Box ml={2} color={'#0060db'}>
                    Download Example
                  </Box>
                </Flex>
              </Link>
            </Box>
            {_renderNameFile()}
          </>
        )}
        {!!addressesValue && isNotCorrectAddress && (
          <Box className={'box-invalid'}>
            <Flex justifyContent="space-between">
              <Box>These are invalid addresses:</Box>
              <Box className="link" onClick={onClearAddressInvalid}>
                Delete All Invalid
              </Box>
            </Flex>
            <Box className="table-valid-address">
              <Flex className="header-list">
                <Box>Address</Box>
                <Box>LINE</Box>
              </Flex>
              <>
                {addressesInvalid.map(({ value, index }) => {
                  if (index === -1) {
                    return null;
                  }
                  return (
                    <Flex key={index} className="content-list">
                      <Box>{value || 'Unknown'}</Box>
                      <Box>{index + 1}</Box>
                    </Flex>
                  );
                })}
              </>
            </Box>
          </Box>
        )}
      </AppField>
    </Flex>
  );
};

export default PartFormAddressActivity;
