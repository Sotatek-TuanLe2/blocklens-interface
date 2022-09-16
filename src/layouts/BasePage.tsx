import { ReactNode, FC } from 'react';
import Footer from 'src/layouts/Footer';
import Header from 'src/layouts/Header';
import { Box } from '@chakra-ui/react';
import React from 'react';

interface IBasePage {
  children?: ReactNode;
}

const BasePage: FC<IBasePage> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box
        minH={'calc(100vh - 135px)'}
        maxW={'1240px'}
        margin={'0 auto'}
        marginTop={'70px'}
      >
        {children}</Box>
      <Footer />
    </Box>
  );
};

export default BasePage;
