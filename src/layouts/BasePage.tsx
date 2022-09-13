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
        maxWidth={'1240px'}
        px={5}
        pt={'100px'}
        margin={'0 auto'}
        minH={'calc(100vh - 65px)'}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default BasePage;
