import { FC, ReactElement, useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';
import { BasePage } from 'src/layouts';
import { isMobile } from 'react-device-detect';

interface IBasePageAuth {
  className?: string;
  onInitPage?: () => void;
  children: ReactElement;
}

const BasePageAuth: FC<IBasePageAuth> = ({
  onInitPage,
  children,
  className,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onInit = async () => {
    try {
      setIsLoading(true);
      onInitPage && (await onInitPage());
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onInit().then();
  }, []);

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

export default BasePageAuth;
