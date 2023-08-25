import { ReactNode, FC } from 'react';
import { Header } from 'src/layouts';
import { Box } from '@chakra-ui/react';
import React from 'react';
import 'src/styles/layout/Header.scss';

interface IBasePage {
  children?: ReactNode;
  noHeader?: boolean;
}

const GuestPage: FC<IBasePage> = ({ children, noHeader = false }) => {
  return (
    <Box>
      {!noHeader && <Header />}
      <Box
        pt={noHeader ? '0' : '80px'}
        pb={noHeader ? '0' : '60px'}
        minH={'calc(100vh - 80px)'}
        className={'main'}
        overflow={'hidden'}
      >
        {children}
      </Box>
    </Box>
  );
};

export default GuestPage;
