import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppLink } from 'src/components';
import 'src/styles/layout/Header.scss';
import Storage from 'src/utils/utils-storage';
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ArrowLogout, DoorLogout } from 'src/assets/icons';
import useUser from 'src/hooks/useUser';
import { PRIVATE_PATH } from 'src/routes';
import { clearUser } from 'src/store/user';
import { ROUTES } from 'src/utils/common';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import config from 'src/config';
import { clearWallet } from 'src/store/wallet';
import rf from 'src/requests/RequestFactory';

const menus = [
  {
    name: 'Insights',
    path: ROUTES.HOME,
  },
  {
    name: 'Triggers ',
    path: ROUTES.TRIGGERS,
  },
  {
    name: 'APIs',
    path: config.docsPage,
  },
  {
    name: 'Account',
    path: ROUTES.ACCOUNT,
  },
];

const Header: FC = () => {
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);
  const history = useHistory();
  const { user } = useUser();
  const accessToken = Storage.getAccessToken();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    AppBroadcast.on('REQUEST_SIGN_IN', onSignInRequest);
    return () => {
      AppBroadcast.remove('REQUEST_SIGN_IN');
    };
  }, []);

  const onSignInRequest = () => {
    clearAuthentication();
    navigateToLoginPage();
  };

  const clearAuthentication = () => {
    dispatch(clearUser());
    dispatch(clearWallet());
  };

  const navigateToLoginPage = () => {
    if (PRIVATE_PATH.some((path) => location.pathname.includes(path))) {
      history.push(ROUTES.LOGIN);
    }
  };

  const onLogout = async () => {
    try {
      await rf.getRequest('AuthRequest').logout();
      clearAuthentication();
      navigateToLoginPage();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpenMenuMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'inherit';
    }
  }, [isOpenMenuMobile]);

  const _renderAvatar = () => {
    const menus: { title: string; url: string }[] = [
      { title: 'Account', url: ROUTES.ACCOUNT },
      { title: 'Plan & billing', url: ROUTES.BILLING },
    ];

    return (
      <Box>
        <Menu>
          <MenuButton>
            <Avatar name={user?.getFirstName()} size="sm" />
          </MenuButton>
          <MenuList className="menu-header">
            <MenuItem className="user-info">
              <div className="user-name">
                {user?.getFirstName() + ' ' + user?.getLastName()}
              </div>

              <div className="user-email">{user?.getEmail()}</div>
              {menus.map((item, index) => (
                <Box
                  key={index}
                  className={`user-account ${
                    isActiveMenu(item.url) ? 'active' : ''
                  }`}
                  textAlign={'left'}
                  mt={3}
                  fontWeight={500}
                  onClick={() => history.push(item.url)}
                >
                  {item.title}
                </Box>
              ))}
              <div className="user-divider"></div>
              <div className="user-logout" onClick={onLogout}>
                {' '}
                <span className="door-logout">
                  <DoorLogout />
                </span>
                <span className="arrow-logout">
                  <ArrowLogout />
                </span>{' '}
                <span>Log Out</span>
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    );
  };

  const isActiveMenu = (path: string) => {
    if (path === ROUTES.ACCOUNT) {
      return location.pathname === path;
    }

    if (path === ROUTES.BILLING) {
      return location.pathname.includes('billing');
    }

    if (path === ROUTES.TRIGGERS) {
      return (
        location.pathname === path ||
        location.pathname.includes('app') ||
        location.pathname.includes('webhook') ||
        location.pathname.includes('activities')
      );
    }

    if (path === '/') {
      return (
        location.pathname === path ||
        location.pathname.includes('dashboards') ||
        location.pathname.includes('queries')
      );
    }
  };

  const isShowLoginBtn = () => {
    const hiddenBtnPath = [
      ROUTES.LOGIN,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
      ROUTES.SIGN_UP,
    ];
    return !accessToken && !hiddenBtnPath.includes(location.pathname);
  };

  const _renderMenu = () => {
    return (
      <Flex className={`${isMobile ? 'menu-mobile' : 'menu'}`}>
        {menus.map((item, index: number) => {
          if (!isMobile && item.path === ROUTES.ACCOUNT) {
            return;
          }

          if (item.name === 'APIs') {
            return (
              <a
                href={item.path}
                target={'_blank'}
                rel="noreferrer"
                title="Click to APIs"
                key={index}
              >
                {item.name}
              </a>
            );
          }

          if (item.name === 'Account' && !accessToken) {
            return;
          }

          return (
            <AppLink
              to={item.path}
              key={index}
              className={isActiveMenu(item.path) ? 'active' : ''}
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
        <Flex width={'30px'} justifyContent={'flex-end'}>
          {isOpenMenuMobile ? (
            <Box
              className="icon-close-menu"
              onClick={() => setIsOpenMenuMobile(false)}
            ></Box>
          ) : (
            <Box
              onClick={() => setIsOpenMenuMobile(true)}
              className="icon-menu-mobile"
            />
          )}
        </Flex>
      );
    }

    return (
      <>
        {_renderMenu()}
        {accessToken && _renderAvatar()}
      </>
    );
  };

  return (
    <Box className="header">
      <Flex className={'content-header'}>
        <Box onClick={() => history.push('/')} cursor={'pointer'}>
          <img
            src="/images/logo.svg"
            alt="logo"
            width={isMobile ? '140px' : 'auto'}
          />
        </Box>
        <Flex alignItems={'center'}>
          {isMobile && isShowLoginBtn() && (
            <AppButton onClick={() => history.push(ROUTES.LOGIN)} mr={5}>
              Log In
            </AppButton>
          )}

          {_renderContent()}
        </Flex>

        {!isMobile && isShowLoginBtn() && (
          <AppButton onClick={() => history.push(ROUTES.LOGIN)}>
            Log In
          </AppButton>
        )}
      </Flex>
      {isOpenMenuMobile && (
        <Box className="header-mobile">
          {_renderMenu()}

          {accessToken && (
            <div className="user-logout" onClick={onLogout}>
              {' '}
              <span className="door-logout">
                <DoorLogout />
              </span>
              <span className="arrow-logout">
                <ArrowLogout />
              </span>{' '}
              <span>Log Out</span>
            </div>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Header;
