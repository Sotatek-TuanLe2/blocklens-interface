import {
  Box,
  Flex,
  Link,
  Text,
  Checkbox,
  Tooltip,
  useDisclosure,
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
import { Link as ReactLink } from 'react-router-dom';
import 'src/styles/components/AppUploadABI.scss';
import { isMobile } from 'react-device-detect';
import { DownloadIcon } from 'src/assets/icons';
import { Scrollbars } from 'react-custom-scrollbars';

export const TYPE_ABI = {
  NFT: 'NFT',
  CONTRACT: 'CONTRACT',
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
}

const listFunctionAndEventOfNFT = [
  'balanceOf',
  'ownerOf',
  'safeTransferFrom',
  'transferFrom',
  'approve',
  'getApproved',
  'setApprovalForAll',
  'isApprovedForAll',
  'Transfer',
  'Approval',
  'ApprovalForAll',
];

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
    value: 'az',
  },
  {
    label: 'Z - A',
    value: 'za',
  },
];

const ListSelect: FC<IListSelect> = ({
  type,
  data,
  onSelectData,
  dataSelected,
  valueSearch,
  valueSort,
  viewOnly,
}) => {
  const [itemSelected, setItemSelected] = useState<any>([]);

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

    if (valueSort === 'az') {
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

    if (valueSort === 'za') {
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
    <Flex className="box-events">
      <Box className="label-events">
        {type === 'function' ? 'Functions' : 'Events'}
      </Box>
      <Box ml={5} width="100%">
        <Scrollbars
          style={{ width: '100%', height: 300 }}
          autoHide
          renderThumbVertical={({ style, ...props }: any) => (
            <div
              style={{
                ...style,
                backgroundColor: '#8D91A5',
                borderRadius: '5px',
                cursor: 'pointer',
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
                    <Flex className="abi-option">
                      {item.name}
                      {!!inputs.length && (
                        <Box className="inputs">({inputs.join(', ')})</Box>
                      )}
                    </Flex>
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
}) => {
  const [fileSelected, setFileSelected] = useState<any>({});
  const [ABIData, setABIData] = useState<any>([]);
  const [dataSelected, setDataSelected] = useState<any>([]);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueSort, setValueSort] = useState<string>('az');
  const inputRef = useRef<any>(null);

  const handleFileSelect = (evt: any, dropFile?: any) => {
    const file = dropFile || evt.target.files[0];
    if (file.type !== 'application/json') {
      toastError({ message: 'The ABI file must be json file type' });
      return;
    }

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
      type: 'object',
      properties: {
        abi: {
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
        },
        required: ['abi'],
      },
    };

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = e.target.result;

        if (!data || !validateJson.validate(JSON.parse(data), schema).valid) {
          toastError({ message: 'The ABI file must be correct format' });
          return;
        }

        const abi = JSON.parse(data).abi;

        const isCorrectFunctionAndEventOfNFT = listFunctionAndEventOfNFT.every(
          (name: string) => abi.some((abiItem: any) => abiItem.name === name),
        );

        if (type === TYPE_ABI.NFT && !isCorrectFunctionAndEventOfNFT) {
          toastError({ message: 'The ABI file must be correct format' });
          return;
        }

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
    if (type !== TYPE_ABI.NFT) return;
    setABIData(ERC721.abi);
  }, []);

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
      setDataSelected(datABIFilterFormat);
    }
  }, [abi, abiFilter, viewOnly]);

  const listEvent = useMemo(() => {
    const data = ABIData.filter((item: any) => {
      return item.type === 'event';
    });

    return data.map((event: any) => {
      const inputsEvent = event.inputs.map((input: any) => input.name).join('');
      return {
        ...event,
        id: event.name + inputsEvent,
      };
    });
  }, [ABIData]);

  const listFunction = useMemo(() => {
    const data = ABIData.filter((item: any) => {
      return item.type === 'function' && item.stateMutability !== 'view';
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
    const ABISelected = dataSelected.map(({ id, ...rest }: any) => rest);
    onChange && onChange(ABIData, ABISelected);
  }, [ABIData, dataSelected]);

  const onClearFile = () => {
    if (type !== TYPE_ABI.NFT) {
      setDataSelected([]);
      setABIData([]);
      setFileSelected({});
      inputRef.current.value = null;
      return;
    }

    setFileSelected({});
    setABIData(ERC721.abi);
    inputRef.current.value = null;
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

  const _renderNoticeUpload = () => {
    return (
      <Tooltip
        placement={'top'}
        hasArrow
        p={2}
        isOpen={isOpen}
        label={`This is an optional function. If you don't upload a custom ABI file, we would use default ERC-721 file.`}
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
    );
  };

  return (
    <Box className="upload-abi">
      <Flex mb={1} className="label-abi">
        ABI{' '}
        <Text as={'span'} className="text-error" ml={1}>
          *
        </Text>
        {type === TYPE_ABI.NFT && _renderNoticeUpload()}
      </Flex>

      {!viewOnly && (
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
              display="none"
              ref={inputRef}
            />
          </label>

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

          <>
            <ListSelect
              type={'function'}
              data={listFunction}
              dataSelected={dataSelected}
              onSelectData={setDataSelected}
              valueSearch={valueSearch}
              valueSort={valueSort}
              viewOnly={viewOnly}
            />

            <ListSelect
              type={'event'}
              data={listEvent}
              dataSelected={dataSelected}
              onSelectData={setDataSelected}
              valueSearch={valueSearch}
              valueSort={valueSort}
              viewOnly={viewOnly}
            />
          </>
        </Box>
      )}
    </Box>
  );
};

export default AppUploadABI;
