import { Box, Flex, Text } from '@chakra-ui/react';
import { toastError } from 'src/utils/utils-notify';
import { AppInput } from './index';
import React, { useState, FC } from 'react';
const Validator = require('jsonschema').Validator;
const validateJson = new Validator();

interface IAppUploadABI {
  onChange: (value: any) => void;
}

const AppUploadABI: FC<IAppUploadABI> = ({ onChange }) => {
  const [fileSelected, setFileSelected] = useState<any>({});
  const handleFileSelect = (evt: any) => {
    const file = evt.target.files[0];
    if (file.type !== 'application/json') {
      toastError({ message: 'The ABI file must be json file type' });
      return;
    }

    const ABIInputType = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          indexed: { type: 'boolean' },
          components: { type: 'array' },
          internalType: { type: 'string' },
        },
        required: ['name', 'type'],
      },
    };

    const ABIOutInputType = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          components: { type: 'array' },
          internalType: { type: 'string' },
        },
        required: ['name', 'type'],
      },
    };

    const schema = {
      type: 'object',
      properties: {
        abi: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              anonymous: { type: 'boolean' },
              constant: { type: 'boolean' },
              inputs: ABIInputType,
              name: { type: 'string' },
              outputs: ABIOutInputType,
              payable: { type: 'boolean' },
              stateMutability: { type: 'string' },
              type: { type: 'string' },
              gas: { type: 'number' },
            },
            required: ['type'],
          },
        },
      },
    };

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      if (!validateJson.validate(JSON.parse(data), schema).valid) {
        toastError({ message: 'The ABI file must be correct format' });
        return;
      }
      setFileSelected(evt.target.files[0]);
      onChange(JSON.parse(data));
    };
    reader.readAsText(file);
  };
  return (
    <Box>
      <Flex alignItems={'center'}>
        <Text mr={6}>
          ABI
          <Text as={'span'} color={'red.500'}>
            *
          </Text>
        </Text>
        <label>
          <Box
            px={3}
            cursor={'pointer'}
            borderRadius={'10px'}
            py={1}
            bgColor={'blue.500'}
            color={'white'}
          >
            Upload
          </Box>
          <AppInput type="file" onChange={handleFileSelect} display="none" />
        </label>
      </Flex>
      <Box mt={2}>{fileSelected?.name}</Box>
    </Box>
  );
};

export default AppUploadABI;
