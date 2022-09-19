import { FC } from 'react';
import { Box, Flex, Avatar } from '@chakra-ui/react';
import React from 'react';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';
import 'src/styles/layout/Header.scss';
import Storage from 'src/utils/storage';
import { RootState } from 'src/store';
import { useSelector } from 'react-redux';

const Header: FC = () => {
  const history = useHistory();
  const accessToken = Storage.getAccessToken();
  const { userInfo } = useSelector(
    (state: RootState) => state.authentication,
  );

  const _renderGroupButton = () => {
    return (
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
    )
  };

  const _renderAvatar = () => {
    return (
      <Box>
        <Avatar
          src={userInfo?.avatar}
          name={userInfo?.username}
          size="sm"
        />
      </Box>
    )
  };

  return (
    <Box bgColor={'blue.500'} className={'header'}>
      <Flex className={'content-header'}>
        BLOCKLENS
        {accessToken ? _renderAvatar() : _renderGroupButton()}
      </Flex>
    </Box>
  );
};

export default Header;
