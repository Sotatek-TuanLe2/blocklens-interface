import { FC, useEffect } from 'react';
import React from 'react';
import { AppButton, AppLink } from 'src/components';
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
import { clearAuth } from 'src/store/auth';
import { AppBroadcast } from 'src/utils/utils-broadcast';

const menus = [
  {
    name: 'Dashboard',
    path: '/',
  },
  {
    name: 'Billing',
    path: '/setting/billing',
  },
  {
    name: 'Account',
    path: '/setting/profile',
  },
];

const Header: FC = () => {
  const history = useHistory();
  const accessToken = Storage.getAccessToken();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    AppBroadcast.on('LOGOUT_USER', onLogout);
    return () => {
      AppBroadcast.remove('LOGOUT_USER');
    };
  }, []);

  const onLogout = () => {
    dispatch(clearAuth());
    history.push('/login');
  };

  const _renderAvatar = () => {
    return (
      <Box>
        <Menu>
          <MenuButton>
            <Avatar name={userInfo?.firstName} size="sm" />
          </MenuButton>
          <MenuList fontSize={'16px'} color={'black'} maxW="200px">
            <MenuItem className="user-name">
              👋&nbsp; Welcome {userInfo?.firstName + ' ' + userInfo?.lastName}!
            </MenuItem>
            <MenuItem onClick={() => history.push('/setting/profile')}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => history.push('/setting/billing')}>
              Billing
            </MenuItem>
            <MenuItem color={'red.400'} onClick={onLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  };

  const _renderMenu = () => {
    return (
      <Flex className="menu">
        {menus.map((item, index: number) => {
          return (
            <AppLink
              to={item.path}
              key={index}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.name}
            </AppLink>
          );
        })}
      </Flex>
    );
  };

  return (
    <Box className="header">
      <Flex className={'content-header'}>
        <Box onClick={() => history.push('/')} cursor={'pointer'}>
          <img src="/images/logo.png" alt="logo" />
        </Box>
        {accessToken && (
          <>
            {_renderMenu()}
            {_renderAvatar()}
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
