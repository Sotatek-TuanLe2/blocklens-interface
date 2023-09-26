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
import _ from 'lodash';

interface IPartFormAddressActivity {
  dataForm: IDataForm;
  setDataForm: (value: any) => void;
  validator: any;
  chain: string;
}

const isValidAddress = (chain: string, address: string) => {
  if (isEVMNetwork(chain)) return isValidAddressEVM(address);
  return isValidAddressSUIAndAptos(address);
};

const PartFormAddressActivity: FC<IPartFormAddressActivity> = ({
  dataForm,
  setDataForm,
  validator,
  chain,
}) => {
  const [fileSelected, setFileSelected] = useState<any>({});
  const [addressInputs, setAddressInputs] = useState<string[]>(['']);
  const [isInsertManuallyAddress, setIsInsertManuallyAddress] =
    useState<boolean>(true);
  const inputRef = useRef<any>(null);
  const FILE_CSV_EXAMPLE = `/abi/Address_Example_${chain}.csv`;

  const invalidAddresses = useMemo(() => {
    return addressInputs.filter(
      (address) => !!address && !isValidAddress(chain, address),
    );
  }, [addressInputs]);

  const validAddresses = useMemo(() => {
    return addressInputs.filter(
      (address) => !!address && isValidAddress(chain, address),
    );
  }, [addressInputs]);

  useEffect(() => {
    onClearFile();
    setAddressInputs(['']);
    setDataForm({
      ...dataForm,
      metadata: {
        ...dataForm.metadata,
        addresses: [],
      },
    });
  }, [chain]);

  useEffect(() => {
    if (!invalidAddresses || !invalidAddresses.length) {
      setDataForm({
        ...dataForm,
        metadata: {
          ...dataForm.metadata,
          addresses: validAddresses,
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
  }, [addressInputs]);

  const onClearFile = () => {
    setAddressInputs(['']);

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
        addresses: validAddresses,
      },
    });
    setAddressInputs(!!validAddresses.length ? validAddresses : ['']);
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
      setAddressInputs(_.uniq(uploadedAddresses));
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

  const _renderAddressList = () => (
    <AddressList
      chain={chain}
      addressInputs={addressInputs}
      invalidAddresses={invalidAddresses}
      setAddressInputs={setAddressInputs}
      onClearAddressInvalid={onClearAddressInvalid}
    />
  );

  const _renderFileDropbox = () => {
    if (addressInputs[0] === '') {
      return (
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
      );
    }

    return _renderAddressList();
  };

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
            setAddressInputs(['']);
            validator.current.fields = [];
            onClearFile();
          }}
        >
          {!isInsertManuallyAddress ? 'Insert Manually' : 'Upload File'}
        </Box>

        {isInsertManuallyAddress ? (
          _renderAddressList()
        ) : (
          <>
            {_renderFileDropbox()}
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
  addressInputs: string[];
  chain: string;
  onClearAddressInvalid: () => void;
  invalidAddresses: string[];
  setAddressInputs: (value: string[]) => void;
}

const AddressList: FC<IAddressListProps> = ({
  addressInputs,
  invalidAddresses,
  chain,
  onClearAddressInvalid,
  setAddressInputs,
}) => {
  const [isPristine, setIsPristine] = useState<boolean>(false);

  const [firstValue] = addressInputs;

  const onChangeInputAtIndex = (
    newValue: string,
    index: number,
    createNewInput = false,
    filterEmpty = false,
  ) => {
    let updatedAddresses = [...addressInputs];
    updatedAddresses[index] = newValue;
    if (createNewInput) {
      index === addressInputs.length - 1
        ? updatedAddresses.push('')
        : updatedAddresses.splice(index + 1, 0, '');
    }
    if (!!updatedAddresses[0].length && filterEmpty) {
      updatedAddresses = updatedAddresses.filter((input) => input !== '');
    }

    setAddressInputs(_.uniq(updatedAddresses));
    setIsPristine(true);
  };

  return (
    <>
      <Box className="frame-address">
        {addressInputs.map((address, index) => {
          const inValidAddress = !!address && !isValidAddress(chain, address);
          return (
            <AddressInput
              key={`${index}-${Date.now()}`}
              index={index}
              value={address}
              isInvalid={inValidAddress}
              onChangeInputAtIndex={onChangeInputAtIndex}
            />
          );
        })}
        {isPristine && !!firstValue.length && !!invalidAddresses.length && (
          <Flex alignItems="center" mt="28px" ml="16px">
            <Text fontStyle="italic">
              Invalid address: {invalidAddresses.length}
            </Text>
            <Box
              className="btn-delete-address"
              onClick={onClearAddressInvalid}
              onMouseDown={(e) => {
                e.preventDefault();
                onClearAddressInvalid();
              }}
            >
              Delete all invalid
            </Box>
          </Flex>
        )}
      </Box>
      {isPristine && !firstValue.length && (
        <Text className="text-error">The addresses field is required</Text>
      )}
    </>
  );
};

interface IAddressInputProps {
  index: number;
  value: string;
  isInvalid: boolean;
  onChangeInputAtIndex: (
    value: string,
    index: number,
    createNewInput?: boolean,
    filterEmpty?: boolean,
  ) => void;
}

const AddressInput: FC<IAddressInputProps> = ({
  index,
  value,
  isInvalid,
  onChangeInputAtIndex,
}) => {
  const initialEditing = index !== 0 && !value;

  const [isEditing, setIsEditing] = useState<boolean>(initialEditing);
  const [inputValue, setInputValue] = useState<string>(value);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const focusInput = () => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    focusInput();
  }, [isEditing]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onStopEditing = (createNewInput = false, filterEmpty = false) => {
    onChangeInputAtIndex(inputValue, index, createNewInput, filterEmpty);
    setIsEditing(false);
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onChangeInputAtIndex('', index, false, true);
      setIsEditing(false);
    }
    setInputValue(e.target.value);
  };

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !!inputValue) {
      onStopEditing(true);
    }
  };

  return (
    <Flex
      className={`${isEditing ? 'input-address' : 'line-address'}`}
      alignItems="center"
      key={index}
      onClick={() => setIsEditing(true)}
      onBlur={() => onStopEditing(false, true)}
    >
      <Text className="number-index">{index + 1}</Text>
      {isEditing ? (
        <AppInput
          size="sm"
          value={inputValue}
          onChange={onChangeInputValue}
          onKeyPress={onEnter}
          ref={inputRef}
          ml="12px"
        />
      ) : (
        <Flex justifyContent="space-between" ml="12px" w="100%">
          <Text className={`${isInvalid ? 'text-address-error' : ''}`}>
            {inputValue}
          </Text>
          {isInvalid ? (
            <Text className="invalid-card">Invalid</Text>
          ) : (
            <Box w="10px" h="10px"></Box>
          )}
        </Flex>
      )}
    </Flex>
  );
};
