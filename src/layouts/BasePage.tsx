import { FC, ReactElement, useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';
import { GuestPage } from 'src/layouts';
import { isMobile } from 'react-device-detect';
import 'src/styles/layout/BasePage.scss';

interface BasePage {
  className?: string;
  onInitPage?: () => void;
  children: ReactElement;
  isFullWidth?: boolean;
}

const BasePage: FC<BasePage> = ({
  onInitPage,
  children,
  className = '',
  isFullWidth = false,
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
    <GuestPage>
      <Flex
        justifyContent={'center'}
        className={`base-page-container ${className}`}
      >
        <Box
          marginTop={{ base: '30px', lg: '60px' }}
          className={`base-page-container__content ${
            isFullWidth ? 'base-page-container__content--full' : ''
          }`}
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
    </GuestPage>
  );
};

export default BasePage;
