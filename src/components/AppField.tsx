import { ReactNode } from 'react';
import React from 'react';
import { Flex, Stack, Text, FlexProps } from '@chakra-ui/react';

interface IField {
  children: ReactNode;
  label: string;
  isRequired?: boolean;
  customWidth?: string;
  customFlex?: FlexProps;
}

const AppField = ({
  children,
  label,
  isRequired,
  customWidth = '100%',
  customFlex = { mb: 4 },
}: IField) => {
  return (
    <Flex alignItems={'flex-start'} w={['full', customWidth]} {...customFlex}>
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
