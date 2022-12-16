import 'src/styles/pages/LandingPage.scss';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface IHeader {
  isFixedHeader: boolean;
}

const Header: FC<IHeader> = ({ isFixedHeader }) => {
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
    <div className={`header-landing ${isFixedHeader ? 'fixed' : ''}`}>
      <div className="header-landing__content">
        <div>
          <Link to={'#'}>
            <img src="/images/LandingPage/logo.png" alt="logo" />
          </Link>
        </div>

        <div className="menus">
          {menus.map((item, index) => {
            return (
              <Link className="menu" to={item.path} key={index}>
                {item.name}
              </Link>
            );
          })}
          <div>
            <button className="btn-primary">Log in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
