import React from 'react';
import { TableAttributeType } from './MockData';
import { Box, Flex, Text } from '@chakra-ui/react';
import SchemaTitle from './SchemaTitle';

type Props = {
  tableDescribe: TableAttributeType[];
  blockchain: string;
  name: string;
};

const SchemaDescribe = ({ blockchain, name, tableDescribe }: Props) => {
  return (
    <Box>
      <SchemaTitle
        chainName={blockchain}
        tableName={name}
        className={'schema-detail-title'}
      />
      <Box paddingLeft={3} marginTop={2}>
        <Box borderLeft={'1px solid #ccc'} paddingLeft={4}>
          {tableDescribe.map((desc) => (
            <Flex
              key={desc.id}
              justifyContent={'space-between'}
              alignItems={'center'}
              fontSize={14}
              className="block-describe"
            >
              <Box>{desc.column_name}</Box>
              <Text
                padding={1}
                noOfLines={1}
                width={'150px'}
                textAlign={'right'}
              >
                {desc.data_type}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SchemaDescribe;
