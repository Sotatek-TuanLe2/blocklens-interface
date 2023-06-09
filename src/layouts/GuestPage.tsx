import { ReactNode, FC } from 'react';
import { Header } from 'src/layouts';
import { Box, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import 'src/styles/layout/Header.scss';
import theme from 'src/styles/theme';

interface IBasePage {
  children?: ReactNode;
}

const GuestPage: FC<IBasePage> = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Header />
        <Box
          pt={'65px'}
          mb={'60px'}
          minH={'calc(100vh - 80px)'}
          className={'main'}
        >
          {children}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default GuestPage;
