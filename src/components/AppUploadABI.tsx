import {
  Box,
  Flex,
  Link,
  Checkbox,
  Tooltip,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { toastError } from 'src/utils/utils-notify';
import React, {
  useState,
  FC,
  useMemo,
  useRef,
  ChangeEvent,
  useEffect,
} from 'react';
import { AppInput, AppSelect2 } from 'src/components';
import { CloseIcon } from '@chakra-ui/icons';
import ERC721 from 'src/abi/ERC-721.json';
import ERC20 from 'src/abi/erc20.json';
import { Link as ReactLink } from 'react-router-dom';
import 'src/styles/components/AppUploadABI.scss';
import { isMobile } from 'react-device-detect';
import { DownloadIcon } from 'src/assets/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import { ABI_OPTIONS, ABI_TYPES } from 'src/utils/common';

export const TYPE_ABI = {
  NFT: 'NFT',
  CONTRACT: 'CONTRACT',
  TOKEN: 'TOKEN',
};

const FILE_TEMPLATE_NFT = '/abi/ERC-721.json';
const FILE_TEMPLATE_CONTRACT = '/abi/ERC-20.json';

const Validator = require('jsonschema').Validator;
const validateJson = new Validator();

interface IAppUploadABI {
  onChange?: (abi: any[], abiFilter: any[]) => void;
  type?: string;
  viewOnly?: boolean;
  abi?: any[];
  abiFilter?: any[];
  abiContract?: any[];
  isStandardERC?: boolean;
}

interface IListSelect {
  data: any;
  type: string;
  valueSearch: string;
  valueSort: string;
  dataSelected: any;
  viewOnly?: boolean;
  onSelectData: (value: any) => void;
}

const options = [
  {
    label: 'A - Z',
    value: ABI_OPTIONS.AZ,
  },
  {
    label: 'Z - A',
    value: ABI_OPTIONS.ZA,
  },
];

const ABIInputType = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      type: { type: 'string' },
      indexed: { type: 'boolean' },
      components: { type: 'array' },
      internalType: { type: 'string' },
    },
    required: ['name', 'type'],
  },
};

const ABIOutInputType = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      type: { type: 'string' },
      components: { type: 'array' },
      internalType: { type: 'string' },
    },
    required: ['name', 'type'],
  },
};

const schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      anonymous: { type: 'boolean' },
      constant: { type: 'boolean' },
      inputs: ABIInputType,
      name: { type: 'string' },
      outputs: ABIOutInputType,
      payable: { type: 'boolean' },
      stateMutability: { type: 'string' },
      type: { type: 'string' },
      gas: { type: 'number' },
    },
    required: ['type'],
  },
};

const ListSelect: FC<IListSelect> = ({
  type,
  data,
  onSelectData,
  dataSelected,
  valueSearch,
  valueSort,
  viewOnly,
}) => {
  const ITEM_LIMIT = 10;
  const HEIGHT_CHECKBOX = 32;
  const [itemSelected, setItemSelected] = useState<any>([]);

  useEffect(() => {
    if (!data.length || viewOnly) {
      return;
    }
    const initialSelected = data.map((item: any) => item.id);
    setItemSelected(initialSelected);
    onSelectData([...data]);
  }, [data]);

  const onChangeSelect = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    let newItemsSelected = [];

    if (!e.target.checked) {
      newItemsSelected = [
        ...itemSelected.filter((item: string) => item !== id),
      ];
      onSelectData([...dataSelected.filter((item: any) => item.id !== id)]);
    } else {
      newItemsSelected = [...itemSelected, id];
      onSelectData([
        ...dataSelected,
        data.filter((item: any) => item.id === id)[0],
      ]);
    }
    setItemSelected(newItemsSelected);
  };

  const dataShow = useMemo(() => {
    let dataFiltered = data;

    if (!!valueSearch) {
      dataFiltered = dataFiltered.filter((item: any) =>
        item.name.toLowerCase().includes(valueSearch.toLowerCase()),
      );
    }

    if (valueSort === ABI_OPTIONS.AZ) {
      dataFiltered = dataFiltered.sort((a: any, b: any) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }

    if (valueSort === ABI_OPTIONS.ZA) {
      dataFiltered = dataFiltered.sort((a: any, b: any) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        }
        return 0;
      });
    }

    return dataFiltered;
  }, [data, valueSearch, valueSort]);

  const IdsSelected = useMemo(
    () => dataSelected.map((item: any) => item.id),
    [dataSelected],
  );

  const allChecked = dataShow.every((data: any) =>
    itemSelected.some((id: string) => data.id === id),
  );

  const allCheckedViewOnly =
    viewOnly &&
    dataShow.every((data: any) =>
      IdsSelected.some((id: string) => data.id === id),
    );

  const isIndeterminate =
    dataShow.some((data: any) =>
      itemSelected.some((id: string) => data.id === id),
    ) && !allChecked;

  const isIndeterminateViewOnly = useMemo(
    () =>
      dataShow.some((data: any) =>
        IdsSelected.some((id: string) => data.id === id),
      ) &&
      viewOnly &&
      !allCheckedViewOnly,
    [IdsSelected, allCheckedViewOnly, viewOnly],
  );

  const onSelectAll = () => {
    const dataRest = dataSelected.filter((item: any) => item.type !== type);
    if (!allChecked) {
      const allData = dataShow.map((item: any) => item.id);
      onSelectData([...dataRest, ...dataShow]);
      setItemSelected(allData);
      return;
    }
    setItemSelected([]);
    onSelectData([...dataRest]);
  };

  return (
    <Flex className="box-item">
      <Box className="label-events">
        {type === ABI_TYPES.FUNCTION ? 'Functions' : 'Events'}
      </Box>
      <Box ml={5} width="100%">
        <Scrollbars
          className="scroll-bar"
          style={{
            width: '100%',
            height: dataShow.length < ITEM_LIMIT ? '' : 9 * HEIGHT_CHECKBOX,
            minHeight: 'unset',
            maxHeight: 'unset',
          }}
          autoHide
          autoHeight={dataShow.length < ITEM_LIMIT}
          renderThumbVertical={({ style, ...props }: any) => (
            <div
              style={{
                ...style,
                backgroundColor: '#8D91A5',
                borderRadius: '5px',
                cursor: 'pointer',
                minHeight: 'unset',
                maxHeight: 'unset',
              }}
              {...props}
            />
          )}
        >
          {!!dataShow.length && (
            <Checkbox
              size="lg"
              isChecked={allCheckedViewOnly || allChecked}
              isIndeterminate={isIndeterminateViewOnly || isIndeterminate}
              onChange={onSelectAll}
              isDisabled={viewOnly}
            >
              All
            </Checkbox>
          )}
          {!!dataShow.length ? (
            dataShow?.map((item: any, index: number) => {
              const inputs = item.inputs?.map((input: any) => {
                return input.name;
              });

              return (
                <Box key={index} my={2}>
                  <Checkbox
                    size="lg"
                    isDisabled={viewOnly}
                    value={item.name}
                    isChecked={
                      itemSelected.includes(item.id) ||
                      IdsSelected.includes(item.id)
                    }
                    onChange={(e) => onChangeSelect(e, item.id)}
                  >
                    <Tooltip
                      hasArrow
                      placement="top"
                      label={`${item.name} (${inputs.join(', ')})`}
                    >
                      <Flex className="abi-option">
                        {item.name}
                        {!!inputs.length && (
                          <Box className="inputs">({inputs.join(', ')})</Box>
                        )}
                      </Flex>
                    </Tooltip>
                  </Checkbox>
                </Box>
              );
            })
          ) : (
            <Flex justifyContent={'center'}>
              <Box> No data...</Box>
            </Flex>
          )}
        </Scrollbars>
      </Box>
    </Flex>
  );
};

const AppUploadABI: FC<IAppUploadABI> = ({
  onChange,
  type,
  viewOnly,
  abi,
  abiFilter,
  abiContract,
  isStandardERC = true,
}) => {
  const [fileSelected, setFileSelected] = useState<any>({});
  const [ABIData, setABIData] = useState<any>([]);
  const [functionsSelected, setFunctionsSelected] = useState<any>([]);
  const [structsSelected, setStructsSelected] = useState<any>([]);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueSort, setValueSort] = useState<string>(ABI_OPTIONS.AZ);
  const inputRef = useRef<any>(null);
  const [isInsertManuallyAddress, setIsInsertManuallyAddress] =
    useState<boolean>(true);
  const [ABIInput, setABIInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onResetFileSelect = (event: any) => {
    event.target.value = '';
  };

  const handleFileSelect = (evt: any, dropFile?: any) => {
    const file = dropFile || evt.target.files[0];
    if (file.type !== 'application/json') {
      toastError({ message: 'The ABI file must be json file type' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = e.target.result;

        if (!data || !validateJson.validate(JSON.parse(data), schema).valid) {
          toastError({ message: 'The ABI file must be correct format' });
          return;
        }

        const abi = JSON.parse(data);
        setFileSelected(dropFile || evt.target.files[0]);
        setABIData(abi);
      } catch (e) {
        toastError({ message: 'The ABI file must be correct format' });
      }
    };
    reader.readAsText(file);
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

  useEffect(() => {
    if (viewOnly) return;

    if (type == TYPE_ABI.TOKEN) {
      setABIData(ERC20.abi);
      return;
    }

    if (type == TYPE_ABI.NFT) {
      setABIData(ERC721.abi);
      return;
    }
  }, [viewOnly, type]);

  useEffect(() => {
    if (abiContract && !!abiContract?.length) {
      setABIData(abiContract);
    }
  }, [abiContract]);

  useEffect(() => {
    if (viewOnly) {
      const datABIFilterFormat = abiFilter?.map((item: any) => {
        const inputsFunc = item.inputs.map((input: any) => input.name).join('');
        return {
          ...item,
          id: item.name + inputsFunc,
        };
      });
      setABIData(abi);
      setFunctionsSelected(
        datABIFilterFormat?.filter((item) => item.type === ABI_TYPES.FUNCTION),
      );
      setStructsSelected(
        datABIFilterFormat?.filter((item) => item.type === ABI_TYPES.EVENT),
      );
    }
  }, [abi, abiFilter, viewOnly]);

  const structList = useMemo(() => {
    const data = ABIData.filter((item: any) => {
      return item.type === ABI_TYPES.EVENT;
    });

    return data.map((event: any) => {
      const inputsEvent = event.inputs.map((input: any) => input.name).join('');
      return {
        ...event,
        id: event.name + inputsEvent,
      };
    });
  }, [ABIData]);

  const functionList = useMemo(() => {
    const data = ABIData.filter((item: any) => {
      return (
        item.type === ABI_TYPES.FUNCTION && item.stateMutability !== 'view'
      );
    });

    return data.map((func: any) => {
      const inputsFunction = func.inputs
        .map((input: any) => input.name)
        .join('');
      return {
        ...func,
        id: func.name + inputsFunction,
      };
    });
  }, [ABIData]);

  useEffect(() => {
    const ABISelected = [...functionsSelected, ...structsSelected].map(
      ({ id, ...rest }: any) => rest,
    );
    onChange && onChange(ABIData, ABISelected);
  }, [ABIData, functionsSelected, structsSelected]);

  const onClearFile = () => {
    setFunctionsSelected([]);
    setStructsSelected([]);
    setFileSelected({});
    if (type == TYPE_ABI.NFT) {
      setABIData(ERC721.abi);
      return;
    }

    if (type == TYPE_ABI.TOKEN) {
      setABIData(ERC20.abi);
      return;
    }

    setABIData([]);
    return;
  };

  const _renderNameFile = () => {
    if (fileSelected?.name) {
      return (
        <Box className="file-name">
          {fileSelected?.name}
          <CloseIcon onClick={onClearFile} className={'icon-clear'} ml={3} />
        </Box>
      );
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (viewOnly) return;
    if (!ABIInput) {
      setError('');
      if (type == TYPE_ABI.TOKEN) {
        setABIData(ERC20.abi);
      }

      if (type == TYPE_ABI.NFT) {
        setABIData(ERC721.abi);
      }
      return;
    }

    try {
      if (!validateJson.validate(JSON.parse(ABIInput), schema).valid) {
        setError('The ABI must be correct format');
        setABIData([]);
        return;
      }

      setABIData(JSON.parse(ABIInput));
      setError('');
    } catch (e) {
      setError('The ABI must be correct format');
      setABIData([]);
    }
  }, [ABIInput, viewOnly]);

  const isInvalidChecklist = useMemo(() => {
    if (!functionList.length && !structList.length) {
      return false;
    }

    return !functionsSelected.length && !structsSelected.length;
  }, [functionList, structList, functionsSelected, structsSelected]);

  const _renderErrorMessage = (
    condition: boolean,
    message: string,
    props?: any,
  ) => {
    if (!condition) {
      return null;
    }

    return (
      <Text className="text-error" {...props}>
        {message}
      </Text>
    );
  };

  return (
    <Box className="upload-abi">
      {!viewOnly && !abiContract?.length && (
        <Flex justifyContent={'space-between'}>
          <Flex mb={1} className="label-abi">
            <span>ABI&nbsp;</span>
            <Tooltip
              placement={'top'}
              hasArrow
              p={2}
              isOpen={isOpen}
              className="tooltip-app"
              label={`Inputing a valid ABI helps us detect more functions/events to customize your Notification Filter below`}
            >
              <Box
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
                onClick={onOpen}
                className="icon-info"
                ml={2}
                cursor={'pointer'}
              />
            </Tooltip>
          </Flex>
          <Box
            className="link"
            cursor="pointer"
            onClick={() => {
              setIsInsertManuallyAddress(!isInsertManuallyAddress);
              setABIInput('');
              setFileSelected({});
              if (type === TYPE_ABI.NFT) {
                setABIData(ERC721.abi);
              } else if (type === TYPE_ABI.TOKEN) {
                setABIData(ERC20.abi);
              } else {
                setABIData([]);
              }
            }}
          >
            {!isInsertManuallyAddress ? 'Insert Manually' : 'Upload File'}
          </Box>
        </Flex>
      )}

      {isInsertManuallyAddress && !viewOnly && !abiContract?.length && (
        <Box mb={5}>
          <AppInput
            placeholder="Input abi..."
            rows={6}
            value={ABIInput}
            onChange={(e) => setABIInput(e.target.value.trim())}
          />
          <Box color={'red.400'} fontSize={'14px'} mt={1}>
            {error}
          </Box>
          {_renderErrorMessage(
            !isStandardERC,
            type === TYPE_ABI.TOKEN
              ? 'ABI of token must meet erc20 standard'
              : 'ABI of NFT must meet erc721 standard',
            { mt: 2 },
          )}
        </Box>
      )}

      {!viewOnly && !isInsertManuallyAddress && (
        <>
          <label onDrop={onDropHandler} onDragOver={onDragOver}>
            <Box className="box-upload">
              <Box className="icon-upload" mb={4} />
              <Box maxW={'365px'} textAlign={'center'}>
                Drag and drop your JSON file here or browse file from your
                computer.
              </Box>
            </Box>
            <AppInput
              type="file"
              onChange={handleFileSelect}
              onClick={onResetFileSelect}
              display="none"
              ref={inputRef}
            />
          </label>
          {_renderErrorMessage(
            !isStandardERC,
            type === TYPE_ABI.TOKEN
              ? 'ABI of token must meet erc20 standard'
              : 'ABI of NFT must meet erc721 standard',
            { mb: 2 },
          )}
          <Box className="download-template">
            <Link
              as={ReactLink}
              to={
                type !== TYPE_ABI.NFT
                  ? FILE_TEMPLATE_CONTRACT
                  : FILE_TEMPLATE_NFT
              }
              target="_blank"
              download
            >
              <Flex>
                <DownloadIcon />
                <Box ml={2}>Download Example</Box>
              </Flex>
            </Link>
          </Box>
        </>
      )}

      {ABIData && !!ABIData.length && (
        <>
          <Flex mb={2}>
            <span>Notification filter</span>
            <Box as={'span'} color={'red.500'} ml={1}>
              *
            </Box>
            <Tooltip
              placement={'top'}
              hasArrow
              p={2}
              className="tooltip-app"
              label={`Filter out which activities you want to be notified`}
            >
              <Box className="icon-info" ml={2} cursor={'pointer'} />
            </Tooltip>
          </Flex>

          <Box className="abi-detail">
            <Flex
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent={fileSelected?.name ? 'space-between' : 'flex-end'}
              alignItems={isMobile ? 'flex-start' : 'center'}
              mb={3}
            >
              {_renderNameFile()}

              <Flex>
                {!isMobile && (
                  <Box width={'100px'}>
                    <AppSelect2
                      onChange={setValueSort}
                      options={options}
                      value={valueSort}
                    />
                  </Box>
                )}

                <Box width={'215px'}>
                  <AppInput
                    isSearch
                    className={'input-search'}
                    type="text"
                    placeholder={'Search...'}
                    value={valueSearch}
                    onChange={(e) => setValueSearch(e.target.value.trim())}
                  />
                </Box>

                {isMobile && <Box ml={2.5} className="icon-filter-mobile" />}
              </Flex>
            </Flex>

            <Box className="box-events">
              <ListSelect
                type={ABI_TYPES.FUNCTION}
                data={functionList}
                dataSelected={functionsSelected}
                onSelectData={setFunctionsSelected}
                valueSearch={valueSearch}
                valueSort={valueSort}
                viewOnly={viewOnly}
              />

              <ListSelect
                type={ABI_TYPES.EVENT}
                data={structList}
                dataSelected={structsSelected}
                onSelectData={setStructsSelected}
                valueSearch={valueSearch}
                valueSort={valueSort}
                viewOnly={viewOnly}
              />
            </Box>
            {_renderErrorMessage(
              isStandardERC && isInvalidChecklist,
              'The notification filter field is required',
              { mt: 2 },
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AppUploadABI;
