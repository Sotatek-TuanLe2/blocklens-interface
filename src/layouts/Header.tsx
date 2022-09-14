import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

const Header: FC = () => {
  return (
    <Box
      bgColor={'blue.500'}
      height={'70px'}
      position={'fixed'}
      right={0}
      left={0}
      top={0}
      zIndex={999}
    >
      <Flex
        maxWidth={'1240px'}
        px={5}
        justifyContent={'space-between'}
        alignItems={'center'}
        margin={' auto'}
        height={'full'}
        color={'white'}
        fontWeight={500}
        fontSize={'18px'}
      >
        BLOCKLENS
      </Flex>
    </Box>
  );
};

export default Header;
