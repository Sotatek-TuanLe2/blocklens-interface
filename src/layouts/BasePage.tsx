import { FC, ReactElement, useEffect, useState } from 'react';
import { Box, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
import React from 'react';
import { GuestPage } from 'src/layouts';
import 'src/styles/layout/BasePage.scss';
import { useHistory, useLocation } from 'react-router';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { Link } from 'react-router-dom';
import { AppButton } from 'src/components';
import { ROUTES } from 'src/utils/common';
import { useDispatch } from 'react-redux';
import { clearUser } from 'src/store/user';

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
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

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

  const onLogout = () => {
    dispatch(clearUser());
    history.push(ROUTES.LOGIN);
  };

  const _render403 = () => (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      className="error-page"
      height={'100vh'}
    >
      <Stack
        className="error-page"
        textAlign={'center'}
        spacing={'20px'}
        alignItems="center"
      >
        <Heading size={'2xl'}>403</Heading>
        <Heading size={'lg'}>Access Denied</Heading>
        <Heading size={'md'}>
          You do not have permission to access this page
        </Heading>
        <AppButton onClick={onLogout} width={'fit-content'} borderRadius={20}>
          Go to Log-in page
        </AppButton>
      </Stack>
    </Flex>
  );

  const _renderContent = () => {
    if (isLoading) {
      return (
        <Flex justifyContent={'center'}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      );
    }

    console.log('_renderContent', show403Page, 'noHeader', noHeader);

    if (show403Page) {
      return _render403();
    }

    return <Box width={'full'}>{children}</Box>;
  };

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
          {_renderContent()}
        </Box>
      </Flex>
    </GuestPage>
  );
};

export default BasePage;
