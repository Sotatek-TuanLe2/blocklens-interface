import { Box } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import BasePage from 'src/layouts/BasePage';
import FormCreateWebHook from './HomePage/parts/FormCreateWebHook';

const AppDetail = () => {
  return (
    <BasePage>
      <Box
        pt="70px"
        display={'flex'}
        alignItems="center"
        flexDirection={'column'}
      >
        <FormCreateWebHook />
      </Box>
    </BasePage>
  );
};

export default AppDetail;
