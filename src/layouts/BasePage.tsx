import { FC, ReactElement, useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';
import { GuestPage } from 'src/layouts';
import 'src/styles/layout/BasePage.scss';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { Error403Page } from 'src/pages/ErrorPages';

interface BasePage {
  className?: string;
  onInitPage?: () => void;
  children: ReactElement;
  isFullWidth?: boolean;
  noHeader?: boolean;
}

export const TOGGLE_403_PAGE = 'TOGGLE_403_PAGE';

const BasePage: FC<BasePage> = ({
  onInitPage,
  children,
  className = '',
  isFullWidth = false,
  noHeader = false,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show403Page, setShow403Page] = useState<boolean>(false);

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
    AppBroadcast.on(TOGGLE_403_PAGE, setShow403Page);

    onInit().then();

    return () => {
      AppBroadcast.remove(TOGGLE_403_PAGE);
    };
  }, []);

  if (show403Page) {
    return <Error403Page />;
  }

  return (
    <GuestPage noHeader={noHeader}>
      <Flex
        justifyContent={'center'}
        className={`base-page-container ${className}`}
      >
        <Box
          marginTop={{ base: '30px', lg: '40px' }}
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
