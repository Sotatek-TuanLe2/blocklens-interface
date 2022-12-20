import 'src/styles/pages/LandingPage.scss';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { IconMenuMobile, CloseMenuIcon } from 'src/assets/icons';

interface IHeader {
  isFixedHeader: boolean;
}

const Header: FC<IHeader> = ({ isFixedHeader }) => {
  const [isShowHeader, setIsShowHeader] = useState<boolean>(false);

  const menus = [
    {
      name: 'Developer',
      path: '/developer',
    },
    {
      name: 'Documentation',
      path: '/documentation',
    },
    {
      name: 'About us',
      path: '/about-us',
    },
    {
      name: 'Pricing',
      path: '/pricing',
    },
  ];

  return (
    <div
      className={`header-landing ${isFixedHeader ? 'fixed' : ''} ${
        isShowHeader ? 'mobile' : ''
      }`}
    >
      <div className="header-landing__content">
        <div>
          <Link to={'/'}>
            <img src="/images/LandingPage/logo.png" alt="logo" />
          </Link>
        </div>

        {!isMobile && (
          <div className="menus">
            {menus.map((item, index) => {
              return (
                <Link className="menu" to={item.path} key={index}>
                  {item.name}
                </Link>
              );
            })}
            <div>
              <Link to={'/login'}>
                <button className="btn-primary">Log in</button>
              </Link>
            </div>
          </div>
        )}

        {isMobile && (
          <div onClick={() => setIsShowHeader(!isShowHeader)}>
            {isShowHeader ? <CloseMenuIcon /> : <IconMenuMobile />}
          </div>
        )}
      </div>

      {isShowHeader && (
        <div className="menus-mobile">
          {menus.map((item, index) => {
            return (
              <Link className="menu" to={item.path} key={index}>
                {item.name}
              </Link>
            );
          })}

          <div>
            <Link to={'/login'}>
              <button className="btn-primary">Log in</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
