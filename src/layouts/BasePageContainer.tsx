import { FC, ReactElement } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { BasePage } from 'src/layouts';

interface IBasePageContainer {
  className?: string;
  children: ReactElement;
}

const BasePageContainer: FC<IBasePageContainer> = ({ children, className }) => {
  return (
    <BasePage>
      <Flex
        justifyContent={'center'}
        minH={'calc(100vh - 135px)'}
        className={className}
      >
        <Box marginTop={'70px'} maxW={'1240px'} width={'full'}>
          <Box width={'full'}>{children}</Box>
        </Box>
      </Flex>
    </BasePage>
  );
};

export default BasePageContainer;
