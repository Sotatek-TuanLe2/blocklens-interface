import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { AppInput } from '../index';

const ChartSettings = () => {
  return (
    <Box>
      <ChartOptions />
      <ResultDataConfigs />
      <XAxisConfigs />
      <YAxisConfigs />
    </Box>
  );
};

export default ChartSettings;

const ChartOptions = () => {
  return (
    <Box>
      <Box>
        <Text>Title</Text>
        <AppInput />
      </Box>
    </Box>
  );
};

const ResultDataConfigs = () => {
  return (
    <Box>
      <Box>
        <Text>Result data</Text>
        <AppInput />
      </Box>
    </Box>
  );
};

const XAxisConfigs = () => {
  return <Box>XAxis config</Box>;
};

const YAxisConfigs = () => {
  return <Box>YAxis configs</Box>;
};
