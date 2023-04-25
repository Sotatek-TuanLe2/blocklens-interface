import React from 'react';
import { SchemaType } from '../../utils/common';
import { Box, Flex, Text } from '@chakra-ui/react';
import SchemaTitle from './SchemaTitle';

type Props = {
  tableDescribe: SchemaType[];
  blockchain: string;
  name: string;
  fullName: string;
  onAddParameter: any;
};

const SchemaDescribe = ({
  blockchain,
  name,
  tableDescribe,
  fullName,
  onAddParameter,
}: Props) => {
  return (
    <Box>
      <SchemaTitle
        chainName={blockchain}
        tableName={name}
        tableFullName={fullName}
        className={'schema-detail-title'}
      />
      <Box paddingLeft={3} marginTop={2}>
        <Box borderLeft={'1px solid #ccc'} paddingLeft={4}>
          {tableDescribe.map((desc, index) => (
            <Flex
              key={index}
              justifyContent={'space-between'}
              alignItems={'center'}
              fontSize={14}
              className="block-describe"
              onClick={() => onAddParameter(desc.column_name)}
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
