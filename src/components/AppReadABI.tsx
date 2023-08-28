import { Box, Flex, Checkbox, Text, Tooltip } from '@chakra-ui/react';
import React, { useState, FC, useEffect, ChangeEvent, useMemo } from 'react';
import { AppInput, AppSelect2 } from 'src/components';
import 'src/styles/components/AppUploadABI.scss';
import { isMobile } from 'react-device-detect';
import { Scrollbars } from 'react-custom-scrollbars';
import { PackageType } from 'src/utils/utils-webhook';
import { IDataForm } from '../pages/WebHookCreatePage';
import { ABI_OPTIONS, ABI_TYPES } from 'src/utils/common';

interface IDataSelected {
  events?: string[];
  functions?: string[];
}

interface IAppReadABI {
  onChangeForm?: (data: any) => void;
  dataAddress?: PackageType[];
  address: string;
  isViewOnly?: boolean;
  dataForm?: IDataForm;
  dataWebhook?: IDataSelected;
}

interface IListSelect {
  data: IABIItem[];
  type?: string;
  valueSearch: string;
  valueSort: string;
  isViewOnly?: boolean;
  onChangeDataSelected: (data: IABIItem[]) => void;
  dataSelected: IABIItem[];
}

interface IDetailABI {
  dataABI: any;
  onChangeForm: any;
  address: string;
  dataForm?: IDataForm;
  isViewOnly?: boolean;
  dataWebhook?: IDataSelected;
}

interface IABIItem {
  name: string;
  type: string;
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

const ListSelect: FC<IListSelect> = ({
  type,
  data,
  valueSearch,
  valueSort,
  isViewOnly,
  dataSelected,
  onChangeDataSelected,
}) => {
  const ITEM_LIMIT = 10;
  const HEIGHT_CHECKBOX = 32;

  const onChangeSelect = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (!e.target.checked) {
      onChangeDataSelected([
        ...dataSelected.filter((item: IABIItem) => item.name !== id),
      ]);
    } else {
      onChangeDataSelected([
        ...dataSelected,
        data.filter((item: IABIItem) => item.name === id)[0],
      ]);
    }
  };

  const formatFunctions = (address: string) => {
    const pos = address.indexOf('::');
    return address.slice(pos + 2);
  };

  const dataShow = useMemo(() => {
    let dataFiltered = data;
    if (!!valueSearch) {
      dataFiltered = dataFiltered.filter((item: IABIItem) =>
        formatFunctions(item.name)
          .toLowerCase()
          .includes(valueSearch.toLowerCase()),
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

  const allChecked = useMemo(
    () =>
      dataShow.every((data: IABIItem) =>
        dataSelected.some((item) => data.name === item.name),
      ),
    [dataShow, dataSelected],
  );

  const onSelectAll = () => {
    if (!dataSelected.length) {
      onChangeDataSelected(dataShow);
      return;
    }

    onChangeDataSelected(allChecked ? [] : dataShow);
  };

  const isIndeterminate =
    dataShow.some((data: IABIItem) =>
      dataSelected.some((item) => data.name === item.name),
    ) && !allChecked;

  return (
    <Flex className="box-item">
      <Box className="label-events" width={'220px'}>
        {type === ABI_TYPES.FUNCTION ? 'Exposed Functions' : 'Structs'}
      </Box>
      <Box ml={5} width="100%">
        <Scrollbars
          className="scroll-filter"
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
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={onSelectAll}
              isDisabled={isViewOnly}
            >
              All
            </Checkbox>
          )}

          {!!dataShow.length ? (
            dataShow.map((item: IABIItem, index: number) => (
              <Box key={index} my={2}>
                <Checkbox
                  size="lg"
                  isDisabled={isViewOnly}
                  value={item.name}
                  isChecked={dataSelected.some(
                    (data) => data.name === item.name,
                  )}
                  onChange={(e) => onChangeSelect(e, item.name)}
                >
                  <Flex className="abi-option">
                    {formatFunctions(item.name)}
                  </Flex>
                </Checkbox>
              </Box>
            ))
          ) : (
            <Flex justifyContent={'center'} mt={10}>
              <Box> No data...</Box>
            </Flex>
          )}
        </Scrollbars>
      </Box>
    </Flex>
  );
};

const DetailABI: FC<IDetailABI> = ({
  dataABI,
  address,
  onChangeForm,
  dataForm,
  isViewOnly,
  dataWebhook,
}) => {
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueSort, setValueSort] = useState<string>(ABI_OPTIONS.AZ);
  const [functionList, setFunctionList] = useState<IABIItem[]>([]);
  const [structList, setStructList] = useState<IABIItem[]>([]);
  const [functionSelected, setFunctionSelected] = useState<IABIItem[]>([]);
  const [eventsSelected, setEventsSelected] = useState<IABIItem[]>([]);

  useEffect(() => {
    const functions: IABIItem[] = [];
    const structs: IABIItem[] = [];

    if (dataABI && !!dataABI.length) {
      dataABI?.forEach((packageItem: any) => {
        if (packageItem && !!packageItem?.modules?.length) {
          packageItem?.modules?.forEach((moduleItem: any) => {
            if (moduleItem?.abi?.exposed_functions?.length) {
              moduleItem?.abi?.exposed_functions?.forEach(
                (functionItem: any) => {
                  functions.push({
                    name: `${address}::${moduleItem?.name}::${functionItem?.name}`,
                    type: 'exposed_functions',
                  });
                },
              );
            }

            if (moduleItem?.abi?.structs?.length) {
              moduleItem?.abi?.structs?.forEach((structItem: any) => {
                structs.push({
                  name: `${address}::${moduleItem?.name}::${structItem?.name}`,
                  type: 'structs',
                });
              });
            }
          });
        }
      });
    }

    setFunctionList(functions);
    setStructList(structs);
    if (isViewOnly) {
      setFunctionSelected(
        functions.filter((item) => dataWebhook?.functions?.includes(item.name)),
      );
      setEventsSelected(
        structs.filter((item) => dataWebhook?.events?.includes(item.name)),
      );
    } else {
      setFunctionSelected(functions);
      setEventsSelected(structs);
    }
  }, [dataABI]);

  useEffect(() => {
    if (isViewOnly) return;
    const functions = functionSelected.map((item) => item.name);
    const events = eventsSelected.map((item) => item.name);
    onChangeForm &&
      onChangeForm({
        ...dataForm,
        metadata: {
          ...dataForm?.metadata,
          functions,
          events,
        },
      });
  }, [functionSelected, eventsSelected]);

  const isInvalidChecklist = useMemo(() => {
    if (!functionList.length && !structList.length) {
      return false;
    }

    return !functionSelected.length && !eventsSelected.length;
  }, [functionList, structList, functionSelected, eventsSelected]);

  return (
    <Box className="abi-detail" mb={4}>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent={'flex-end'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        mb={3}
        w={'full'}
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

      <Box pb={4} className="box-events">
        {!!functionList.length && (
          <ListSelect
            type={ABI_TYPES.FUNCTION}
            data={functionList}
            valueSearch={valueSearch}
            valueSort={valueSort}
            onChangeDataSelected={setFunctionSelected}
            dataSelected={functionSelected}
            isViewOnly={isViewOnly}
          />
        )}

        {!!structList.length && (
          <ListSelect
            type={ABI_TYPES.STRUCT}
            data={structList}
            valueSearch={valueSearch}
            valueSort={valueSort}
            onChangeDataSelected={setEventsSelected}
            dataSelected={eventsSelected}
            isViewOnly={isViewOnly}
          />
        )}
      </Box>
      {isInvalidChecklist && (
        <Box className="text-error">
          The notification filter field is required
        </Box>
      )}
    </Box>
  );
};

const AppReadABI: FC<IAppReadABI> = ({
  onChangeForm,
  dataAddress,
  address,
  dataForm,
  isViewOnly,
  dataWebhook,
}) => {
  return (
    <Box className="upload-abi">
      <Flex mb={1} className="label-abi">
        <Tooltip
          hasArrow
          placement="top"
          label="Choosing which activities you want to be notified"
        >
          Notification filter
        </Tooltip>
        <Text as={'span'} className="text-error" ml={1}>
          *
        </Text>
      </Flex>

      <DetailABI
        dataABI={dataAddress}
        onChangeForm={onChangeForm}
        address={address}
        dataForm={dataForm}
        isViewOnly={isViewOnly}
        dataWebhook={dataWebhook}
      />
    </Box>
  );
};

export default AppReadABI;
