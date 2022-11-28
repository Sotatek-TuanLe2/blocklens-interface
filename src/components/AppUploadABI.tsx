import { Box, Flex, Link, Text, Checkbox, Tooltip } from '@chakra-ui/react';
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

  const onChangeSelect = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    let newItemsSelected = [];

    if (!e.target.checked) {
      newItemsSelected = [
        ...itemSelected.filter((item: string) => item !== name),
      ];
      onSelectData([...dataSelected.filter((item: any) => item.name !== name)]);
    } else {
      newItemsSelected = [...itemSelected, name];
      onSelectData([
        ...dataSelected,
        data.filter((item: any) => item.name === name)[0],
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

  const nameSelected = useMemo(
    () => dataSelected.map((item: any) => item.name),
    [dataSelected],
  );

  const allChecked = dataShow.every((data: any) =>
    itemSelected.some((name: string) => data.name === name),
  );

  const allCheckedViewOnly =
    viewOnly &&
    dataShow.every((data: any) =>
      nameSelected.some((name: string) => data.name === name),
    );

  const isIndeterminate =
    dataShow.some((data: any) =>
      itemSelected.some((name: string) => data.name === name),
    ) && !allChecked;

  const isIndeterminateViewOnly = useMemo(
    () =>
      dataShow.some((data: any) =>
        nameSelected.some((name: string) => data.name === name),
      ) &&
      viewOnly &&
      !allCheckedViewOnly,
    [nameSelected, allCheckedViewOnly, viewOnly],
  );

  const onSelectAll = () => {
    const dataRest = dataSelected.filter((item: any) => item.type !== type);
    if (!allChecked) {
      const allData = dataShow.map((item: any) => item.name);
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
      <Box maxH={'320px'} overflowY={'auto'} ml={5}>
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
            return (
              <Box key={index} my={2}>
                <Checkbox
                  size="lg"
                  isDisabled={viewOnly}
                  value={item.name}
                  isChecked={
                    itemSelected.includes(item.name) ||
                    nameSelected.includes(item.name)
                  }
                  onChange={(e) => onChangeSelect(e, item.name)}
                >
                  {item.name}
                </Checkbox>
              </Box>
            );
          })
        ) : (
          <Flex justifyContent={'center'}>
            <Box> No data...</Box>
          </Flex>
        )}
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

  const handleFileSelect = (evt: any) => {
    const file = evt.target.files[0];
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
      const data = e.target.result;

      if (!validateJson.validate(JSON.parse(data), schema).valid) {
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

      setFileSelected(evt.target.files[0]);
      setABIData(abi);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (type !== TYPE_ABI.NFT) return;
    setABIData(ERC721.abi);
  }, []);

  useEffect(() => {
    if (viewOnly) {
      setABIData(abi);
      setDataSelected(abiFilter);
    }
  }, [abi, abiFilter, viewOnly]);

  const listEvent = useMemo(
    () =>
      ABIData.filter((item: any) => {
        return item.type === 'event';
      }),
    [ABIData],
  );

  const listFunction = useMemo(
    () =>
      ABIData.filter((item: any) => {
        return item.type === 'function' && item.stateMutability !== 'view';
      }),
    [ABIData],
  );

  useEffect(() => {
    onChange && onChange(ABIData, dataSelected);
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

  const _renderNoticeUpload = () => {
    return (
      <Tooltip
        p={2}
        label={`This is an optional function. If you don't upload a custom ABI file, we would use default ERC-721 file.`}
      >
        <Box className="icon-info" ml={2} cursor={'pointer'} />
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
          <label>
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
                <Box className="icon-download" mr={2} />
                Download Example
              </Flex>
            </Link>
          </Box>
        </>
      )}

      {ABIData && !!ABIData.length && (
        <Box className="abi-detail">
          <Flex
            justifyContent={fileSelected?.name ? 'space-between' : 'flex-end'}
            alignItems={'center'}
            mb={3}
          >
            {_renderNameFile()}

            <Flex>
              <Box width={'100px'}>
                <AppSelect2
                  onChange={setValueSort}
                  options={options}
                  value={valueSort}
                />
              </Box>
              <Box width={'200px'}>
                <AppInput
                  isSearch
                  className={'input-search'}
                  type="text"
                  placeholder={'Search...'}
                  value={valueSearch}
                  onChange={(e) => setValueSearch(e.target.value.trim())}
                />
              </Box>
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
