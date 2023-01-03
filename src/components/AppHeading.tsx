import { Box, Flex } from '@chakra-ui/react';
import { AppLink } from './index';
import React, { FC } from 'react';

interface IHeading {
  title: string;
  linkBack?: string;
}

const AppHeading: FC<IHeading> = ({ title, linkBack }) => {
  return (
    <Flex className="title-heading">
      {linkBack && (
        <AppLink to={linkBack}>
          <Box className="icon-arrow-left" mr={6} />
        </AppLink>
      )}

      <Box>{title}</Box>
    </Flex>
  );
};

export default AppHeading;
