import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import 'src/styles/layout/Header.scss';

const Footer: FC = () => {
  return (
    <Flex
      className={'footer'}
    >
      <Box padding={'20px'} fontWeight={600} textAlign={'center'}>
        &copy; 2022 SOTA LABS. All Rights Reserved.
      </Box>
    </Flex>
  );
};

export default Footer;
