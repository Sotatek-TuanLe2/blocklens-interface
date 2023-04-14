import React, { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Select, Text } from '@chakra-ui/react';
import { tableDetail } from '../../../components/SqlEditor/MockData';
import DashboardsRequest from '../../../requests/DashboardsRequest';
import { ArrowBackIcon } from '@chakra-ui/icons';
import 'src/styles/components/EditorSidebar.scss';
import { SchemaType, TableAttributeType } from '../../../utils/common';
import _, { debounce } from 'lodash';

const TIME_DEBOUNCE = 1000;
import { AppInput, AppSelect2 } from '../../../components';
import SchemaDescribe from '../../../components/SqlEditor/SchemaDescribe';
import SchemaTitle from '../../../components/SqlEditor/SchemaTitle';
import { getErrorMessage } from '../../../utils/utils-helper';
import { getLogoChainByChainId } from '../../../utils/utils-network';
import { toastError } from '../../../utils/utils-notify';

const EditorSidebar = () => {
  const [tableSelected, setTableSelected] = useState<{
    chain: string;
    name: string;
  } | null>(null);
  const [schemas, setSchemas] = useState<TableAttributeType[]>([]);
  const [paramsSearch, setParamsSearch] = useState({ chain: '', search: '' });
  const [schemaDescribe, setSchemaDescribe] = useState<SchemaType[] | null>();

  const selectSchemaTitleHandler = async ({
    chain,
    name,
  }: {
    chain: string;
    name: string;
  }) => {
    setTableSelected({ chain, name });
    try {
      const dashboardRequest = new DashboardsRequest();
      const data = await dashboardRequest.getSchema({
        namespace: chain,
        tableName: name,
      });
      setSchemaDescribe(data);
      //get schema
    } catch (error) {
      console.log('error', error);
    }
  };
  const clickBackIconHandler = () => {
    setTableSelected(null);
    setSchemaDescribe(null);
  };

  const fetchDataTable = async () => {
    try {
      const dashboardRequest = new DashboardsRequest();
      const params = _.omitBy({ ...paramsSearch }, (v) => v === '');
      const tables = await dashboardRequest.getTable(params);
      setSchemas(tables);
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  const debounceFetchTablaData = useCallback(
    debounce(fetchDataTable, TIME_DEBOUNCE),
    [paramsSearch],
  );

  useEffect(() => {
    debounceFetchTablaData();
    return () => {
      debounceFetchTablaData.cancel();
    };
  }, [debounceFetchTablaData]);

  const renderTableDescribe = () => {
    return (
      tableSelected &&
      schemaDescribe && (
        <SchemaDescribe
          tableDescribe={schemaDescribe}
          blockchain={tableSelected?.chain}
          name={tableSelected.name}
        />
      )
    );
  };

  const renderListSchema = () => {
    return (
      !tableSelected && (
        <Box className="list-schema custom-scroll">
          {!!schemas.length &&
            schemas.map((schema, index) => (
              <Box key={index + 'list-schema'}>
                <SchemaTitle
                  chainName={schema.namespace}
                  tableName={schema.table_name}
                  className={'row-element'}
                  onClick={() =>
                    selectSchemaTitleHandler({
                      chain: schema.namespace,
                      name: schema.table_name,
                    })
                  }
                />
              </Box>
            ))}
        </Box>
      )
    );
  };

  const handleChangeChainSelect = (value: any) => {
    setParamsSearch((pre) => ({ ...pre, chain: value }));
  };

  const handleFilterTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParamsSearch((pre) => ({ ...pre, search: e.target.value }));
  };

  const renderHeaderRawTable = () => {
    return (
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Box className={'dataset-title'}></Box>
        <Box className="select-chains">
          <AppSelect2
            value={paramsSearch.chain}
            options={[
              { label: 'All chains', value: '' },
              { label: 'APTOS', value: 'APTOS' },
            ]}
            onChange={handleChangeChainSelect}
          />
        </Box>
      </Flex>
    );
  };
  return (
    <Box
      maxW={'380px'}
      width={'100%'}
      height="100%"
      px={5}
      className="editor-sidebar"
    >
      <AppInput
        value={paramsSearch.search}
        marginBottom={4}
        placeholder={'Filter tables...'}
        size="md"
        onChange={(e) => handleFilterTable(e)}
      />
      <Box marginBottom={4}>
        {tableSelected ? (
          <Flex alignItems={'center'}>
            <Flex
              className="header-table"
              alignItems={'center'}
              onClick={clickBackIconHandler}
            >
              <ArrowBackIcon />
              <Box className={getLogoChainByChainId('ETH')} marginLeft={2} />
              <Text ml={2}>{tableSelected?.chain}</Text>
              <Text ml={2}>{tableSelected?.name}</Text>
            </Flex>
          </Flex>
        ) : (
          renderHeaderRawTable()
        )}
      </Box>
      {renderListSchema()}
      {renderTableDescribe()}
    </Box>
  );
};

export default EditorSidebar;
