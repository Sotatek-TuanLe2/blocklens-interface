import { Box, Flex, Checkbox, Text } from '@chakra-ui/react';
import React, { useState, FC, useRef, useEffect } from 'react';
import { AppInput, AppSelect2 } from 'src/components';
import { CloseIcon } from '@chakra-ui/icons';
import 'src/styles/components/AppUploadABI.scss';
import { isMobile } from 'react-device-detect';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  ExposedFunctionType,
  ModuleType,
  PackageType,
  StructType,
} from 'src/utils/utils-webhook';

export const TYPE_ABI = {
  NFT: 'NFT',
  CONTRACT: 'CONTRACT',
};

interface IStructAndFunction {
  name: string;
  selected: boolean;
}

interface IModule {
  name: string;
  abi: {
    exposed_functions: IStructAndFunction[];
    structs: IStructAndFunction[];
  };
}

interface IPackageContractAddress {
  name: string;
  modules: IModule[];
}

interface IAppReadABI {
  onChange?: (abi: any[]) => void;
  dataPackageContractAddress?: PackageType[];
}

interface IListSelect {
  data: IStructAndFunction[];
  type?: string;
  onFetchData: (data: IStructAndFunction[]) => void;
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

const ListSelect: FC<IListSelect> = ({ type, data, onFetchData }) => {
  const [selectData, setSelectData] = useState<IStructAndFunction[]>(
    data || [],
  );

  useEffect(() => {
    data ? setSelectData(data) : setSelectData([]);
  }, [data]);

  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  const onSelectedAll = () => {
    const newData = selectData.map((m) => ({
      ...m,
      selected: !selectedAll,
    }));
    setSelectData(newData);
    setSelectedAll(!selectedAll);
    onFetchData(newData);
  };

  const onSelectChange = (value: string) => {
    const newData = selectData.map((m) =>
      m.name === value ? { ...m, selected: !m.selected } : { ...m },
    );
    setSelectData(newData);
    setSelectedAll(newData.every((e) => e.selected));
    onFetchData(newData);
  };

  return (
    // @ts-ignore
    <Flex className="box-events">
      <Box className="label-events">
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
          <Checkbox
            size="lg"
            onChange={() => onSelectedAll()}
            isChecked={selectedAll}
            defaultChecked={selectedAll}
          >
            All
          </Checkbox>

          {selectData.map((item: IStructAndFunction, index: number) => (
            <Box key={index} my={2}>
              <Checkbox
                size="lg"
                value={item.name}
                onChange={() => onSelectChange(item.name)}
                isChecked={item.selected}
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
  packageItem: IPackageContractAddress;
  updateData: (
    packageName: string,
    moduleName: string,
    type: 'structs' | 'exposed_functions',
    data: IStructAndFunction[],
  ) => void;
}

const DetailABI: FC<IDetailABI> = ({ packageItem, updateData }) => {
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueSort, setValueSort] = useState<string>('az');

  const { name: packageName, modules: dataModules } = packageItem;

  const [listModule, setListModule] = useState<IModule[]>(dataModules);

  useEffect(() => {
    const newModules = dataModules.map((moduleItem) => {
      const exposed_functions = moduleItem.abi.exposed_functions.sort(
        (a: any, b: any) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        },
      );
      const structs = moduleItem.abi.structs.sort((a: any, b: any) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });

      return {
        name: moduleItem.name,
        abi: {
          exposed_functions:
            valueSort === 'az'
              ? exposed_functions
              : exposed_functions.reverse(),
          structs: valueSort === 'az' ? structs : structs.reverse(),
        },
      };
    });

    setListModule(newModules);
  }, [valueSort]);

  useEffect(() => {
    const newModules = dataModules.map((moduleItem) => {
      const exposed_functions = moduleItem.abi.exposed_functions.filter((f) =>
        f.name.toLowerCase().includes(valueSearch.toLowerCase()),
      );
      const structs = moduleItem.abi.structs.filter((f) => {
        return f.name.toLowerCase().includes(valueSearch.toLowerCase());
      });

      return {
        name: moduleItem.name,
        abi: { exposed_functions, structs },
      };
    });

    setListModule(newModules);
  }, [valueSearch]);

  return (
    packageItem && (
      <Box className="abi-detail" mb={4}>
        <Flex
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent={'space-between'}
          alignItems={isMobile ? 'flex-start' : 'center'}
          mb={3}
        >
          <Flex align={'center'}>
            <Box mr={2}>Package:</Box>
            <Box className="file-name">{packageName}</Box>
          </Flex>

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

        <Box>
          {listModule.map((moduleItem, index) => (
            <Box key={index} pb={4}>
              <Text textTransform={'uppercase'} fontWeight={'600'} mb={4}>
                {moduleItem.name}
              </Text>
              {!!moduleItem.abi.exposed_functions.length && (
                <ListSelect
                  type={'function'}
                  data={moduleItem.abi.exposed_functions}
                  onFetchData={(data: IStructAndFunction[]) => {
                    updateData(
                      packageItem.name,
                      moduleItem.name,
                      'exposed_functions',
                      data,
                    );
                  }}
                />
              )}

              {!!moduleItem.abi.structs.length && (
                <ListSelect
                  type={'struct'}
                  data={moduleItem.abi.structs}
                  onFetchData={(data: IStructAndFunction[]) => {
                    updateData(
                      packageItem.name,
                      moduleItem.name,
                      'structs',
                      data,
                    );
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    )
  );
};

const AppReadABI: FC<IAppReadABI> = ({
  onChange,
  dataPackageContractAddress,
}) => {
  const [mapPackageContractAddress, setMapPackageContractAddress] = useState<
    IPackageContractAddress[]
  >(null!);

  useEffect(() => {
    onChange && onChange(mapPackageContractAddress);
  }, [mapPackageContractAddress]);

  useEffect(() => {
    if (dataPackageContractAddress && !!dataPackageContractAddress.length) {
      const mapPackages = dataPackageContractAddress
        .map((packageItem: PackageType) => {
          const modules = packageItem.modules
            .map((moduleItem: ModuleType) => {
              // exposed_functions...
              const exposed_functions = moduleItem.abi.exposed_functions
                .filter((f: ExposedFunctionType) => f.name)
                .map((func: ExposedFunctionType) => ({
                  name: func.name,
                  selected: false,
                }));
              // structs...
              const structs = moduleItem.abi.structs
                .filter((f: StructType) => f.name)
                .map((struct) => ({
                  name: struct.name,
                  selected: false,
                }));

              return {
                name: moduleItem.name,
                abi: {
                  exposed_functions,
                  structs,
                },
              };
            })
            .filter(
              (f: IModule) =>
                !!f.abi.exposed_functions.length || !!f.abi.structs.length,
            );

          return { name: packageItem.name, modules };
        })
        .filter((f: IPackageContractAddress) => !!f.modules.length);

      setMapPackageContractAddress(mapPackages);
    } else {
      setMapPackageContractAddress(null!);
    }
  }, [dataPackageContractAddress]);

  const onUpdateData = (
    packageName: string,
    moduleName: string,
    type: 'structs' | 'exposed_functions',
    data: IStructAndFunction[],
  ) => {
    const newMapPackages = mapPackageContractAddress.map((packgeItem) => {
      if (packgeItem.name === packageName) {
        const modules = packgeItem.modules.map((moduleItem) => {
          if (moduleItem.name === moduleName) {
            return type === 'exposed_functions'
              ? {
                  ...moduleItem,
                  abi: { ...moduleItem.abi, exposed_functions: data },
                }
              : { ...moduleItem, abi: { ...moduleItem.abi, structs: data } };
          }
          return moduleItem;
        });
        return { ...packgeItem, modules };
      }
      return packgeItem;
    });
    setMapPackageContractAddress(newMapPackages);
  };

  return mapPackageContractAddress && !!mapPackageContractAddress.length ? (
    <Box className="upload-abi">
      <Flex mb={1} className="label-abi">
        ABI
      </Flex>
      {mapPackageContractAddress.map(
        (packageItem, packageIndex: number) =>
          !!packageItem.modules.length && (
            <DetailABI
              key={packageIndex}
              packageItem={packageItem}
              updateData={onUpdateData}
            />
          ),
      )}
    </Box>
  ) : null;
};

export default AppReadABI;
