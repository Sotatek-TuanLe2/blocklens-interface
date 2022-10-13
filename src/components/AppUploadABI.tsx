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
import { AppCard, AppInput, AppSelect } from 'src/components';
import { CloseIcon } from '@chakra-ui/icons';
import ERC721 from 'src/abi/ERC-721.json';
import AppButton from './AppButton';
import { Link as ReactLink } from 'react-router-dom';

export const TYPE_ABI = {
  NFT: 'NFT',
  CONTRACT: 'CONTRACT',
};

const LINK_ABI_NFT = '/abi/ERC-721.json';

const Validator = require('jsonschema').Validator;
const validateJson = new Validator();

interface IAppUploadABI {
  onChange: (abi: any[], abiFilter: any[]) => void;
  type?: string;
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
  title: string;
  valueSearch: string;
  valueSort: string;
  dataSelected: any;
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
  title,
  data,
  onSelectData,
  dataSelected,
  valueSearch,
  valueSort,
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

  return (
    <AppCard mt={5} pt={0}>
      <Box fontSize={'18px'} mb={5}>
        {title}
      </Box>
      <Box maxH={'320px'} overflowY={'auto'} ml={5}>
        {!!dataShow.length ? (
          dataShow?.map((item: any, index: number) => {
            return (
              <Box key={index} my={2}>
                <Checkbox
                  value={item.name}
                  isChecked={itemSelected.includes(item.name)}
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
    </AppCard>
  );
};

const AppUploadABI: FC<IAppUploadABI> = ({ onChange, type }) => {
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
    onChange(ABIData, dataSelected);
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
        <>
          {fileSelected?.name}
          <CloseIcon
            cursor={'pointer'}
            onClick={onClearFile}
            fontSize={'13px'}
            color={'red'}
            ml={3}
          />
        </>
      );
    }

    if (type === TYPE_ABI.NFT) {
      return (
        <Link as={ReactLink} to={LINK_ABI_NFT} target="_blank" download>
          <AppButton
            size={'sm'}
            variant={'outline'}
            borderColor={'green'}
            color={'green'}
          >
            TEMPLATE
          </AppButton>
        </Link>
      );
    }

    return <> </>;
  };

  const _renderNoticeUpload = () => {
    if (type !== TYPE_ABI.NFT) {
      return (
        <Text as={'span'} color={'red.500'}>
          *
        </Text>
      );
    }

    return (
      <Tooltip
        p={2}
        label={`This is an optional function. If you don't upload a custom ABI file, we would use default ERC-721 file.`}
      >
        <Box className="icon-detail_info" ml={2} cursor={'pointer'}></Box>
      </Tooltip>
    );
  };

  return (
    <Box width={'full'}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Flex alignItems={'center'}>
          <Flex mr={6} alignItems={'center'}>
            ABI
            {_renderNoticeUpload()}
          </Flex>

          <label>
            <Box
              px={3}
              cursor={'pointer'}
              borderRadius={'4px'}
              fontSize={'14px'}
              py={'6px'}
              bgColor={'#4C84FF'}
              color={'white'}
              mr={5}
            >
              UPLOAD
            </Box>

            <AppInput
              type="file"
              onChange={handleFileSelect}
              display="none"
              ref={inputRef}
            />
          </label>

          {_renderNameFile()}
        </Flex>

        {ABIData && !!ABIData.length && (
          <Flex>
            <Box width={'200px'}>
              <AppSelect
                onChange={(e: any) => {
                  setValueSort(e.value);
                }}
                options={options}
                defaultValue={options[0]}
              />
            </Box>
            <AppInput
              ml={10}
              type="text"
              placeholder={'Search'}
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value.trim())}
            />
          </Flex>
        )}
      </Flex>

      {ABIData && !!ABIData.length && (
        <>
          <ListSelect
            title={'Functions'}
            data={listFunction}
            dataSelected={dataSelected}
            onSelectData={setDataSelected}
            valueSearch={valueSearch}
            valueSort={valueSort}
          />

          <ListSelect
            title={'Events'}
            data={listEvent}
            dataSelected={dataSelected}
            onSelectData={setDataSelected}
            valueSearch={valueSearch}
            valueSort={valueSort}
          />
        </>
      )}
    </Box>
  );
};

export default AppUploadABI;
