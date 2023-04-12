import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { tableDetail } from '../../../components/SqlEditor/MockData';
import DashboardsRequest from '../../../requests/DashboardsRequest';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { toastError } from '../../../utils/utils-notify';
import SchemaTitle from '../../../components/SqlEditor/SchemaTitle';
import SchemaDescribe from '../../../components/SqlEditor/SchemaDescribe';
import { getLogoChainByChainId } from '../../../utils/utils-network';
import { getErrorMessage } from '../../../utils/utils-helper';
import { AppInput, AppSelect2 } from '../../../components';
import 'src/styles/components/EditorSidebar.scss';
import { SchemaType } from '../../../utils/common';

const EditorSidebar = () => {
  const [tableSelected, setTableSelected] = useState<{
    chain: string;
    name: string;
  } | null>(null);
  const [schemas, setSchemas] = useState<SchemaType[]>([]);
  const [chainSelected, setChangeSelected] = useState('');

  const selectSchemaTitleHandler = ({
    chain,
    name,
  }: {
    chain: string;
    name: string;
  }) => {
    setTableSelected({ chain, name });
  };
  const clickBackIconHandler = () => {
    setTableSelected(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const dashboardRequest = new DashboardsRequest();
        const schemas = await dashboardRequest.getSchemas({
          category: 'arbitrum',
        });
        setSchemas(schemas);
      } catch (error) {
        toastError(getErrorMessage(error));
      }
    })();
  }, []);

  const renderTableDescribe = () => {
    return (
      tableSelected && (
        <SchemaDescribe
          tableDescribe={tableDetail}
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
          {schemas.map((schema) => (
            <Box key={schema.id}>
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
    setChangeSelected(value);
    console.log(value);
  };

  const renderHeaderRawTable = () => {
    return (
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Box className={'dataset-title'}></Box>
        <Box className="select-chains">
          <AppSelect2
            value={chainSelected}
            options={[
              { label: 'All chains', value: '' },
              { label: 'Ethereum', value: 'Ethereum' },
              { label: 'Polygon', value: 'Polygon' },
            ]}
            onChange={handleChangeChainSelect}
          />
        </Box>
      </Flex>
    );
  };
  return (
    <Box
      maxW={'500px'}
      width={'100%'}
      height="100%"
      px={5}
      className="editor-sidebar"
    >
      <AppInput marginBottom={4} placeholder={'Filter tables...'} size="md" />
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
