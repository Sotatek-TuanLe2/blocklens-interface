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
    <Box display={'flex'} justifyContent={'center'}>
      <Box maxW="1240px">
        <Header />
        <Box pt={'135px'} minH={'calc(100vh - 130px)'}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default BasePage;
