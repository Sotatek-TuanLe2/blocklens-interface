import { FC, ReactElement } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';
import { BasePage } from 'src/layouts';
import { isMobile } from 'react-device-detect';

interface IBasePageContainer {
  className?: string;
  isLoading?: boolean;
  children: ReactElement;
}

const BasePageContainer: FC<IBasePageContainer> = ({
  isLoading,
  children,
  className,
}) => {
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
          {isLoading ? (
            <Flex justifyContent={'center'}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            <Box width={'full'}>{children}</Box>
          )}
        </Box>
      </Flex>
    </BasePage>
  );
};

export default BasePageContainer;
