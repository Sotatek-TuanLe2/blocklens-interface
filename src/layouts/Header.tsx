import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';
import 'src/styles/layout/Header.scss';

const Header: FC = () => {
  const history = useHistory();
  return (
    <Box bgColor={'blue.500'} className={'header'}>
      <Flex className={'content-header'}>
        BLOCKLENS
        <Flex>
          <AppButton
            className={'button'}
            size={'md'}
            onClick={() => history.push('/login')}
          >
            Login
          </AppButton>
          <AppButton
            className={'button'}
            ml={3}
            size={'md'}
            onClick={() => history.push('/sign-up')}
          >
            Sign up
          </AppButton>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
