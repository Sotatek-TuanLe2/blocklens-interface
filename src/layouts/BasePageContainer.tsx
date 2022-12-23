import { FC, ReactElement } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { BasePage } from 'src/layouts';
import { isMobile } from 'react-device-detect';

interface IBasePageContainer {
  className?: string;
  children: ReactElement;
}

const BasePageContainer: FC<IBasePageContainer> = ({ children, className }) => {
  return (
    <BasePage>
      <Flex
        justifyContent={'center'}
        minH={'calc(100vh - 200px)'}
        className={className}
      >
        <Box
          marginTop={isMobile ? '50px' : '70px'}
          maxW={'1210px'}
          width={'full'}
          px={4}
        >
          <Box width={'full'}>{children}</Box>
        </Box>
      </Flex>
    </BasePage>
  );
};

export default BasePageContainer;
