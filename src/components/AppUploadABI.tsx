import { Box, Flex, Text, Checkbox } from '@chakra-ui/react';
import { toastError } from 'src/utils/utils-notify';
import React, {
  useState,
  FC,
  useMemo,
  useRef,
  ChangeEvent,
  useEffect,
} from 'react';
import { AppPagination, AppCard, AppInput, AppSelect } from 'src/components';
import { CloseIcon } from '@chakra-ui/icons';

const Validator = require('jsonschema').Validator;
const validateJson = new Validator();

interface IAppUploadABI {
  onChange: (abi: any[], abiFilter: any[]) => void;
}

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

const itemsPerPage = 10;

const ListSelect: FC<IListSelect> = ({
  title,
  data,
  onSelectData,
  dataSelected,
  valueSearch,
  valueSort,
}) => {
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
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

  const onChangePagination = (event: { selected: number }) => {
    setPage(event.selected);
  };

  const dataShow = useMemo(() => {
    let dataFiltered = data;

    if (!!valueSearch) {
      dataFiltered = dataFiltered.filter((item: any) =>
        item.name.includes(valueSearch),
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

    setTotalPages(Math.ceil(dataFiltered.length / itemsPerPage));

    return dataFiltered.slice(
      page * itemsPerPage,
      page * itemsPerPage + itemsPerPage,
    );
  }, [data, page, valueSearch, valueSort]);

  return (
    <AppCard mt={5} pt={0}>
      <Box fontSize={'18px'} mb={5}>
        {title}
      </Box>
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

      {totalPages > 0 && (
        <Flex justifyContent={'flex-end'}>
          <AppPagination
            pageCount={totalPages}
            forcePage={page}
            onPageChange={onChangePagination}
          />
        </Flex>
      )}
    </AppCard>
  );
};

const AppUploadABI: FC<IAppUploadABI> = ({ onChange }) => {
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
      },
    };

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      if (!validateJson.validate(JSON.parse(data), schema).valid) {
        toastError({ message: 'The ABI file must be correct format' });
        return;
      }
      setFileSelected(evt.target.files[0]);
      setABIData(JSON.parse(data).abi);
    };
    reader.readAsText(file);
  };

  const events = useMemo(
    () =>
      ABIData.filter((item: any) => {
        return item.type === 'event';
      }),
    [ABIData],
  );

  const functions = useMemo(
    () =>
      ABIData.filter((item: any) => {
        return item.type === 'function';
      }),
    [ABIData],
  );

  useEffect(() => {
    onChange(ABIData, dataSelected);
  }, [ABIData, dataSelected]);

  const onClearFile = () => {
    setDataSelected([]);
    setABIData([]);
    setFileSelected({});
    inputRef.current.value = null;
  };

  return (
    <Box width={'full'}>
      <Flex alignItems={'center'}>
        <Text mr={6}>
          ABI
          <Text as={'span'} color={'red.500'}>
            *
          </Text>
        </Text>
        <label>
          <Box
            px={3}
            cursor={'pointer'}
            borderRadius={'10px'}
            py={1}
            bgColor={'blue.500'}
            color={'white'}
          >
            Upload
          </Box>
          <AppInput
            type="file"
            onChange={handleFileSelect}
            display="none"
            ref={inputRef}
          />
        </label>
      </Flex>

      {ABIData && !!ABIData.length && (
        <>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Box mt={2}>
              {fileSelected?.name}
              <CloseIcon
                cursor={'pointer'}
                onClick={onClearFile}
                fontSize={'13px'}
                color={'red'}
                ml={3}
              />
            </Box>
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
          </Flex>

          <ListSelect
            title={'Functions'}
            data={functions}
            dataSelected={dataSelected}
            onSelectData={setDataSelected}
            valueSearch={valueSearch}
            valueSort={valueSort}
          />

          <ListSelect
            title={'Events'}
            data={events}
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
