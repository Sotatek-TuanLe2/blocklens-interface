import { FC, useEffect, useState } from 'react';
import { AppButton, AppLink } from 'src/components';
import { useHistory } from 'react-router';
import 'src/styles/layout/Header.scss';
import Storage from 'src/utils/utils-storage';
import { useDispatch } from 'react-redux';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import ModalSignInRequest from 'src/modals/ModalSignInRequest';
import { isMobile } from 'react-device-detect';
import { ArrowLogout, DoorLogout } from 'src/assets/icons';
import { clearUser } from 'src/store/user';
import useUser from 'src/hooks/useUser';
import { ROUTES } from 'src/utils/common';
import { PRIVATE_PATH } from 'src/routes';

const menus = [
  {
    name: 'Dashboard',
    path: ROUTES.HOME,
  },
  {
    name: 'Notification',
    path: ROUTES.NOTIFICATION,
  },
  // {
  //   name: 'Billing',
  //   path: '/billing',
  // },
  {
    name: 'Account',
    path: ROUTES.ACCOUNT,
  },
  // {
  //   name: 'Query SQL',
  //   path: '/dashboards',
  // },
];

const Header: FC = () => {
  const [isOpenSignInRequestModal, setIsOpenSignInRequestModal] =
    useState<boolean>(false);
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false);
  const history = useHistory();
  const { user } = useUser();
  const accessToken = Storage.getAccessToken();
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
      onLogout();
      setIsOpenSignInRequestModal(true);
    }
  };

  const onLogout = () => {
    dispatch(clearUser());
    if (PRIVATE_PATH.some((path) => location.pathname.includes(path))) {
      history.push(ROUTES.HOME);
    }
  };

  const _renderAvatar = () => {
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
        {/* <Button size="sm" colorScheme="blue" onClick={toggleColorMode}>
          Toggle Mode
        </Button> */}
      </Box>
    );
  };

  const isActiveMenu = (path: string) => {
    if (path === ROUTES.ACCOUNT) {
      return location.pathname === path;
    }

    if (path === '/billing') {
      return location.pathname.includes('billing');
    }

    if (path === ROUTES.NOTIFICATION) {
      return (
        location.pathname === path ||
        location.pathname.includes('apps') ||
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

  const _renderMenu = () => {
    return (
      <Flex className={`${isMobile ? 'menu-mobile' : 'menu'}`}>
        {menus.map((item, index: number) => {
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
    // if (isMobile) {
    //   return (
    //     <>
    //       {isOpenMenuMobile ? (
    //         <Box
    //           className={'btn-close'}
    //           onClick={() => setIsOpenMenuMobile(false)}
    //         >
    //           <CloseIcon width={'11px'} />
    //         </Box>
    //       ) : (
    //         <Box
    //           onClick={() => setIsOpenMenuMobile(true)}
    //           className="icon-menu-mobile"
    //         />
    //       )}
    //     </>
    //   );
    // }

    return (
      <>
        {/*{_renderMenu()}*/}
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
            width={isMobile ? '140px' : 'auto'}
          />
        </Box>
        {accessToken
          ? _renderContent()
          : location.pathname !== ROUTES.LOGIN && (
              <AppButton onClick={() => history.push(ROUTES.LOGIN)}>
                Log In
              </AppButton>
            )}
      </Flex>

      <ModalSignInRequest
        open={isOpenSignInRequestModal}
        onClose={() => setIsOpenSignInRequestModal(false)}
      />

      {isOpenMenuMobile && (
        <Box className="header-mobile">
          {_renderMenu()}

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
        </Box>
      )}
    </Box>
  );
};

export default Header;
