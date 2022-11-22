import { ReactNode, FC } from 'react';
import { Footer, Header } from 'src/layouts';
import { Box } from '@chakra-ui/react';
import React from 'react';
import 'src/styles/layout/Header.scss';

interface IBasePage {
  children?: ReactNode;
}

const BasePage: FC<IBasePage> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box pt={'65px'} mb={'60px'} minH={'calc(100vh - 80px)'} className={'main'}>
        {children}
      </Box>
    </Box>
  );
};

export default BasePage;
