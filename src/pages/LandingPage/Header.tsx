import 'src/styles/pages/LandingPage.scss';
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
    <div className="header-landing">
      <div>
        <img src="/images/LandingPage/logo.png" alt="logo" />
      </div>

      <div className="menus">
        {menus.map((item) => {
          return (
            <Link className="menu" to={item.path}>
              {item.name}
            </Link>
          );
        })}
        <div>
          <button className="btn-primary">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
