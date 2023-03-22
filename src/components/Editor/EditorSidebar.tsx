import React, { useState } from 'react';
import { Box, Flex, Select, Text } from '@chakra-ui/react';
import { tableDetail, schemas } from './MockData';
import SchemaTitle from './SchemaTitle';
import 'src/styles/components/EditorSidebar.scss';
import TableDescribeCard from './TableDescribeCard';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getLogoChainByChainId } from '../../utils/utils-network';
import { AppInput } from '../index';

const EditorSidebar = () => {
  const [tableSelected, setTableSelected] = useState<{
    chain: string;
    name: string;
  } | null>(null);

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

  const renderTableDescribe = () => {
    return (
      tableSelected && (
        <TableDescribeCard
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
        <Box maxH={'400px'} overflow={'scroll'}>
          {schemas.map((schema) => (
            <Box>
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

  const renderHeaderRawTable = () => {
    return (
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Box className={'dataset-title'}>
          <ArrowBackIcon />
          <Text as={'span'} marginLeft={3}>
            Raw tables
          </Text>
        </Box>
        <Select height={'32px'} maxW={'40%'}>
          <option>All chains</option>
          <option>Ethereum</option>
          <option>Polygon</option>
        </Select>
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
      <AppInput marginBottom={4} placeholder={'Filter tables...'} />
      <Box marginBottom={4}>
        {tableSelected ? (
          <Flex alignItems={'center'} marginBottom={4}>
            <ArrowBackIcon onClick={clickBackIconHandler} />
            <Box className={getLogoChainByChainId('ETH')} marginLeft={2} />
            <Text ml={2}>{tableSelected?.chain}</Text>
            <Text ml={2}>{tableSelected?.name}</Text>
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
