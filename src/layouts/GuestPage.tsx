import { ReactNode, FC } from 'react';
import { Header } from 'src/layouts';
import { Box } from '@chakra-ui/react';
import React from 'react';
import 'src/styles/layout/Header.scss';

interface IBasePage {
  children?: ReactNode;
}

const GuestPage: FC<IBasePage> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box
        pt={'80px'}
        mb={'60px'}
        minH={'calc(100vh - 80px)'}
        className={'main'}
      >
        {children}
      </Box>
    </Box>
  );
};

export default GuestPage;
