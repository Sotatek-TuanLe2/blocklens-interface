import { FC, useEffect, useState } from 'react';
import React from 'react';
import { AppLink } from 'src/components';
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
import ModalSignInRequest from 'src/modals/ModalSignInRequest';
import { isMobile } from 'react-device-detect';
import { CloseIcon } from '@chakra-ui/icons';

const menus = [
  {
    name: 'Dashboard',
    path: '/',
  },
  {
    name: 'Billing',
    path: '/account',
  },
  {
    name: 'Account',
    path: '/account',
  },
];

const Header: FC = () => {
  const [isOpenSignInRequestModal, setIsOpenSignInRequestModal] =
    useState<boolean>(false);
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);
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

  useEffect(() => {
    AppBroadcast.on('REQUEST_SIGN_IN', onSignInRequest);
    return () => {
      AppBroadcast.remove('REQUEST_SIGN_IN');
    };
  }, []);

  const onSignInRequest = () => {
    if (!isOpenSignInRequestModal) {
      setIsOpenSignInRequestModal(true);
    }
  };

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
            <MenuItem onClick={() => history.push('/account')}>
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
      <Flex className={`${isMobile ? 'menu-mobile' : 'menu'}`}>
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

  const _renderContent = () => {
    if (isMobile) {
      return (
        <>
          {isOpenMenuMobile ? (
            <Box
              className={'btn-close'}
              onClick={() => setIsOpenMenuMobile(false)}
            >
              <CloseIcon width={"11px"}/>
            </Box>
          ) : (
            <Box
              onClick={() => setIsOpenMenuMobile(true)}
              className="icon-menu-mobile"
            />
          )}
        </>
      );
    }

    return (
      <>
        {_renderMenu()}
        {_renderAvatar()}
      </>
    );
  };

  return (
    <Box className="header">
      <Flex className={'content-header'}>
        <Box onClick={() => history.push('/')} cursor={'pointer'}>
          <img
            src="/images/logo.png"
            alt="logo"
            width={isMobile ? '140px' : '180px'}
          />
        </Box>
        {accessToken && _renderContent()}
      </Flex>

      <ModalSignInRequest
        open={isOpenSignInRequestModal}
        onClose={() => setIsOpenSignInRequestModal(false)}
      />

      {isOpenMenuMobile && <Box className="header-mobile">
        {_renderMenu()}
      </Box>}
    </Box>
  );
};

export default Header;
