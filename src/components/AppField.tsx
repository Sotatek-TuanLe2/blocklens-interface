import { ReactNode } from 'react';
import React from 'react';
import { Flex, Stack, Text } from '@chakra-ui/react';

interface IField {
  children: ReactNode;
  label: string;
  isRequired?: boolean;
  customWidth?: string;
}

const AppField = ({
  children,
  label,
  isRequired,
  customWidth = '100%',
}: IField) => {
  return (
    <Flex alignItems={'flex-start'} w={['full', customWidth]} mb={4}>
      <Stack w={'full'} spacing={1}>
        <Text whiteSpace={'nowrap'} mr={2} textTransform={'uppercase'}>
          {label}{' '}
          {isRequired && (
            <Text as={'span'} color={'red.500'}>
              *
            </Text>
          )}
        </Text>
        {children}
      </Stack>
    </Flex>
  );
};

export default AppField;
