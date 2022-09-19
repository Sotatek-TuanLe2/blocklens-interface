import { FC, useEffect } from 'react';
import React from 'react';
import { AppButton } from 'src/components';
import { useHistory } from 'react-router';
import 'src/styles/layout/Header.scss';
import Storage from 'src/utils/storage';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { setUserInfo, clearAuth } from 'src/store/authentication';
import rf from 'src/requests/RequestFactory';

const Header: FC = () => {
  const history = useHistory();
  const accessToken = Storage.getAccessToken();
  const { userInfo } = useSelector((state: RootState) => state.authentication);
  const location = useLocation();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const user = await rf.getRequest('AuthRequest').getInfoUser();
      dispatch(setUserInfo(user));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUser().then();
    }
  }, [accessToken]);

  const onLogout = () => {
    Storage.logout();
    dispatch(clearAuth());
    history.push('/login');
  };

  const _renderGroupButton = () => {
    return (
      <Flex>
        {location.pathname !== '/login' && (
          <AppButton
            className={'button'}
            size={'md'}
            onClick={() => history.push('/login')}
          >
            Login
          </AppButton>
        )}

        {location.pathname !== '/sign-up' && (
          <AppButton
            className={'button'}
            ml={3}
            size={'md'}
            onClick={() => history.push('/sign-up')}
          >
            Sign up
          </AppButton>
        )}
      </Flex>
    );
  };

  const _renderAvatar = () => {
    return (
      <Box>
        <Menu>
          <MenuButton>
            <Avatar
              name={userInfo?.firstName}
              size="sm"
            />
          </MenuButton>
          <MenuList color={'red.400'} fontSize={'16px'}>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  };

  return (
    <Box className={'header'}>
      <Flex className={'content-header'}>
        BLOCKLENS
        {accessToken ? _renderAvatar() : _renderGroupButton()}
      </Flex>
    </Box>
  );
};

export default Header;
