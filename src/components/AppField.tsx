import { ReactNode } from 'react';
import React from 'react';
import { Box, Flex, Stack, Text, Tooltip } from '@chakra-ui/react';

interface IField {
  children: ReactNode;
  label: string;
  isRequired?: boolean;
  customWidth?: string;
  note?: string;
}

const AppField = ({
  children,
  label,
  isRequired,
  customWidth = '100%',
  note,
}: IField) => {
  return (
    <Flex alignItems={'flex-start'} w={['full', customWidth]} mb={4}>
      <Stack w={'full'} spacing={1}>
        <Flex alignItems={'center'}>
          <Text whiteSpace={'nowrap'} mr={2} textTransform={'uppercase'}>
            {label}{' '}
            {isRequired && (
              <Text as={'span'} color={'red.500'}>
                *
              </Text>
            )}
          </Text>
          {note && (
            <Tooltip p={2} label={note}>
              <Box className="icon-detail_info" ml={1} cursor={'pointer'}></Box>
            </Tooltip>
          )}
        </Flex>
        {children}
      </Stack>
    </Flex>
  );
};

export default AppField;
