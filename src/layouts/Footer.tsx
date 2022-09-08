import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

const Footer: FC = () => {
  return (
    <Flex
      width={'full'}
      justifyContent={'center'}
      alignItems={'center'}
      flexWrap={'wrap'}
    >
      <Box padding={'20px'} fontWeight={600} textAlign={'center'}>
        &copy; 2022 SOTA LABS. All Rights Reserved.
      </Box>
    </Flex>
  );
};

export default Footer;
