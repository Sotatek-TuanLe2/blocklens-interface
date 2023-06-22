import { Box, Flex, Checkbox, Text } from '@chakra-ui/react';
import React, { useState, FC, useEffect, ChangeEvent, useMemo } from 'react';
import { AppInput, AppSelect2 } from 'src/components';
import 'src/styles/components/AppUploadABI.scss';
import { isMobile } from 'react-device-detect';
import { Scrollbars } from 'react-custom-scrollbars';
import { PackageType } from 'src/utils/utils-webhook';
import { IDataForm } from '../pages/CreateWebhookPage';

interface IAppReadABI {
  onChangeForm?: (data: any) => void;
  dataAddress?: PackageType[];
  address: string;
  dataForm: IDataForm;
}

interface IListSelect {
  data: IABIItem[];
  type?: string;
  valueSearch: string;
  valueSort: string;
  viewOnly?: boolean;
  onChangeDataSelected: (data: IABIItem[]) => void;
  dataSelected: IABIItem[];
}

interface IABIItem {
  name: string;
  type: string;
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
  valueSearch,
  valueSort,
  viewOnly,
  dataSelected,
  onChangeDataSelected,
}) => {
  const [itemSelected, setItemSelected] = useState<any>([]);

  const onChangeSelect = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    let newItemsSelected = [];

    if (!e.target.checked) {
      newItemsSelected = [
        ...itemSelected.filter((item: string) => item !== id),
      ];
      onChangeDataSelected([
        ...dataSelected.filter((item: IABIItem) => item.name !== id),
      ]);
    } else {
      newItemsSelected = [...itemSelected, id];
      onChangeDataSelected([
        ...dataSelected,
        data.filter((item: IABIItem) => item.name === id)[0],
      ]);
    }

    setItemSelected(newItemsSelected);
  };

  const dataShow = useMemo(() => {
    let dataFiltered = data;

    if (!!valueSearch) {
      dataFiltered = dataFiltered.filter((item: IABIItem) =>
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

  const allChecked = useMemo(
    () =>
      dataShow.every((data: IABIItem) =>
        itemSelected.some((id: string) => data.name === id),
      ),
    [dataShow, itemSelected],
  );

  const onSelectAll = () => {
    if (!itemSelected.length) {
      const allData = dataShow.map((item: any) => item.name);
      setItemSelected(allData);
      onChangeDataSelected(dataShow);
      return;
    }

    if (allChecked) {
      onChangeDataSelected([]);
      setItemSelected([]);
    } else {
      const allData = dataShow.map((item: any) => item.name);
      setItemSelected(allData);
      onChangeDataSelected(dataShow);
    }
  };

  const isIndeterminate =
    dataShow.some((data: IABIItem) =>
      itemSelected.some((id: string) => data.name === id),
    ) && !allChecked;

  return (
    <Flex className="box-events">
      <Box className="label-events" width={'200px'}>
        {type === 'function' ? 'Exposed Functions' : 'Structs'}
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
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={onSelectAll}
              isDisabled={viewOnly}
            >
              All
            </Checkbox>
          )}

          {dataShow.map((item: IABIItem, index: number) => (
            <Box key={index} my={2}>
              <Checkbox
                size="lg"
                isDisabled={viewOnly}
                value={item.name}
                isChecked={itemSelected.includes(item.name)}
                onChange={(e) => onChangeSelect(e, item.name)}
              >
                <Flex className="abi-option">{item.name}</Flex>
              </Checkbox>
            </Box>
          ))}
        </Scrollbars>
      </Box>
    </Flex>
  );
};

interface IDetailABI {
  dataABI: any;
  onChangeForm: any;
  address: string;
  dataForm: IDataForm;
}

const DetailABI: FC<IDetailABI> = ({
  dataABI,
  address,
  onChangeForm,
  dataForm,
}) => {
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueSort, setValueSort] = useState<string>('az');
  const [exposedFunctions, setExposedFunctions] = useState<IABIItem[]>([]);
  const [structs, setStructs] = useState<IABIItem[]>([]);
  const [functionSelected, setFunctionSelected] = useState<IABIItem[]>([]);
  const [eventsSelected, setEventsSelected] = useState<IABIItem[]>([]);

  useEffect(() => {
    const exposedFunctionsList: IABIItem[] = [];
    const structsList: IABIItem[] = [];

    if (dataABI && !!dataABI.length) {
      dataABI?.forEach((packageItem: any) => {
        if (packageItem && !!packageItem?.modules?.length) {
          packageItem?.modules?.forEach((moduleItem: any) => {
            if (moduleItem?.abi?.exposed_functions?.length) {
              moduleItem?.abi?.exposed_functions?.forEach(
                (functionItem: any) => {
                  exposedFunctionsList.push({
                    name: `${address.slice(0, 3)}::${moduleItem?.name}::${
                      functionItem?.name
                    }`,
                    type: 'exposed_functions',
                  });
                },
              );
            }

            if (moduleItem?.abi?.structs?.length) {
              moduleItem?.abi?.structs?.forEach((structItem: any) => {
                structsList.push({
                  name: `${address.slice(0, 3)}::${moduleItem?.name}::${
                    structItem?.name
                  }`,
                  type: 'structs',
                });
              });
            }
          });
        }
      });
    }

    setExposedFunctions(exposedFunctionsList);
    setStructs(structsList);
  }, [dataABI]);

  useEffect(() => {
    const functions = functionSelected.map((item) => item.name);
    const events = eventsSelected.map((item) => item.name);
    onChangeForm({
      ...dataForm,
      aptosAbi: {
        functions,
        events,
      },
    });
  }, [functionSelected, eventsSelected]);

  return (
    <Box className="abi-detail" mb={4}>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent={'space-between'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        mb={3}
      >
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

      <Box pb={4}>
        {!!exposedFunctions.length && (
          <ListSelect
            type={'function'}
            data={exposedFunctions}
            valueSearch={valueSearch}
            valueSort={valueSort}
            onChangeDataSelected={setFunctionSelected}
            dataSelected={functionSelected}
          />
        )}

        {!!structs.length && (
          <ListSelect
            type={'struct'}
            data={structs}
            valueSearch={valueSearch}
            valueSort={valueSort}
            onChangeDataSelected={setEventsSelected}
            dataSelected={eventsSelected}
          />
        )}
      </Box>
    </Box>
  );
};

const AppReadABI: FC<IAppReadABI> = ({
  onChangeForm,
  dataAddress,
  address,
  dataForm,
}) => {
  return (
    <Box className="upload-abi">
      <Flex mb={1} className="label-abi">
        ABI
      </Flex>

      <DetailABI
        dataABI={dataAddress}
        onChangeForm={onChangeForm}
        address={address}
        dataForm={dataForm}
      />
    </Box>
  );
};

export default AppReadABI;
