import { Box, Flex } from '@chakra-ui/react';
import { AppLink } from './index';
import React, { FC } from 'react';

interface IHeading {
  title: string;
  linkBack?: string;
  isCenter?: boolean;
}

const AppHeading: FC<IHeading> = ({ title, linkBack, isCenter= false }) => {
  return (
    <Flex className="title-heading">
      {linkBack && (
        <AppLink to={linkBack}>
          <Box className="icon-arrow-left" mr={6} />
        </AppLink>
      )}

      <Box className={isCenter ? 'title-heading--center': ''}>{title}</Box>
    </Flex>
  );
};

export default AppHeading;
