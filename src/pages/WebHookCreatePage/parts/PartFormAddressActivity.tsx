import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { AppField, AppInput } from 'src/components';
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
  const [addressesInput, setAddressesInput] = useState<string[]>(['']);
  const [isInsertManuallyAddress, setIsInsertManuallyAddress] =
    useState<boolean>(true);
  const inputRef = useRef<any>(null);
  const FILE_CSV_EXAMPLE = `/abi/Address_Example_${chain}.csv`;

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

  const addressValid = useMemo(() => {
    return addressesInput.filter((address: string) => isValidAddress(address));
  }, [addressesInput]);

  useEffect(() => {
    onClearFile();
    setAddressesInput(['']);
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
    setAddressesInput(['']);

    if (!isInsertManuallyAddress) {
      setFileSelected({});
      inputRef.current.value = null;
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
    setAddressesInput(!!addressValid.length ? addressValid : ['']);
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
      const uploadedAddresses = dataFormat.map((item: string) =>
        item.replace('\r', ''),
      );
      if (!uploadedAddresses) {
        toastError({ message: 'The Addresses file must be correct format' });
        return;
      }
      setAddressesInput(uploadedAddresses);
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
            <CloseIcon
              onClick={() => onClearFile()}
              className={'icon-clear'}
              ml={3}
            />
          </Box>
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
      <AppField
        label={`${chain} Addresses`}
        customWidth={'100%'}
        note="Enter to add more addresses"
      >
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
            setAddressesInput(['']);
            validator.current.fields = [];
            // forceUpdate();
            onClearFile();
          }}
        >
          {!isInsertManuallyAddress ? 'Insert Manually' : 'Upload File'}
        </Box>

        {isInsertManuallyAddress ? (
          <AddressList
            addressesInput={addressesInput}
            isValidAddress={isValidAddress}
            onClearAddressInvalid={onClearAddressInvalid}
            addressesInvalid={addressesInvalid}
            setAddressesInput={setAddressesInput}
            fileSelected={fileSelected}
          />
        ) : (
          <>
            {addressesInput[0] === '' ? (
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
            ) : (
              <>
                <AddressList
                  addressesInput={addressesInput}
                  isValidAddress={isValidAddress}
                  onClearAddressInvalid={onClearAddressInvalid}
                  addressesInvalid={addressesInvalid}
                  setAddressesInput={setAddressesInput}
                  fileSelected={fileSelected}
                />
              </>
            )}

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
      </AppField>
    </Flex>
  );
};

export default PartFormAddressActivity;

interface IAddressListProps {
  addressesInput: string[];
  isValidAddress: (address: string) => boolean;
  onClearAddressInvalid: () => void;
  addressesInvalid: { value: string; index: number }[];
  setAddressesInput: (value: string[]) => void;

  fileSelected: any;
}

const AddressList: FC<IAddressListProps> = ({
  addressesInput,
  isValidAddress,
  addressesInvalid,
  onClearAddressInvalid,
  setAddressesInput,
  fileSelected,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  useEffect(() => {
    if (!fileSelected?.name) return;
    setEditingIndex(null);
  }, [fileSelected]);

  const updateAddressAtIndex = (index: number, newValue: string) => {
    const updatedAddresses = [...addressesInput];
    updatedAddresses[index] = newValue;
    setAddressesInput(updatedAddresses);
    setHasInteracted(false);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isBlankAddress = addressesInput.some((i) => i === '');

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }
    if (isBlankAddress) return;

    const newAddresses = [...addressesInput];

    newAddresses.push('');
    setAddressesInput(newAddresses);
    const lastIndex = newAddresses.length - 1;
    setEditingIndex(lastIndex);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const stopEditing = () => {
    if (!!addressesInput[0].length) {
      setAddressesInput(addressesInput.filter((i) => i !== ''));
    }
    setEditingIndex(null);
    setHasInteracted(true);
  };

  const isNotCorrectAddress = useMemo(
    () => addressesInvalid.some(({ index }) => index > -1),
    [addressesInvalid],
  );

  return (
    <>
      <Box className="frame-address">
        {addressesInput.map((address, index) => {
          const isEditing = editingIndex === index;
          const inValidAddress = !isValidAddress(address);
          return (
            <Flex
              className={`${isEditing ? 'input-address' : 'line-address'}`}
              alignItems="center"
              key={index}
              onBlur={stopEditing}
            >
              <Text className="number-index">{index + 1}</Text>
              {isEditing ? (
                <AppInput
                  size="sm"
                  value={addressesInput[index]}
                  onChange={(e) => updateAddressAtIndex(index, e.target.value)}
                  onKeyPress={handleEnterPress}
                  ref={inputRef}
                  ml="12px"
                />
              ) : (
                <Flex
                  justifyContent="space-between"
                  onClick={() => handleEditClick(index)}
                  ml="12px"
                  w="100%"
                >
                  <Text
                    className={`${inValidAddress ? 'text-address-error' : ''}`}
                  >
                    {address}
                  </Text>
                  {inValidAddress && (
                    <Text className="invalid-card">Invalid</Text>
                  )}
                </Flex>
              )}
            </Flex>
          );
        })}
        {hasInteracted &&
          addressesInput.length &&
          !isBlankAddress &&
          isNotCorrectAddress && (
            <Flex alignItems="center" mt="28px" ml="16px">
              <Text fontStyle="italic">
                Invalid address:{' '}
                {addressesInput.filter((i) => !isValidAddress(i)).length}
              </Text>
              <Box
                className="btn-delete-address"
                onClick={onClearAddressInvalid}
              >
                Delete all invalid
              </Box>
            </Flex>
          )}
      </Box>
      {hasInteracted && !addressesInput[0].length && (
        <Text className="text-error">The addresses field is required</Text>
      )}
    </>
  );
};
