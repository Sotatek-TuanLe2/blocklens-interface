import 'src/styles/pages/LandingPage.scss';
import React from 'react';
import { Link } from 'react-router-dom';

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

const linkTerms = [
  {
    name: 'Privacy Policy',
    path: '/privacy-policy',
  },
  {
    name: 'Terms of Service',
    path: '/terms-of-service',
  },
];

const Footer = () => {
  return (
    <div className="footer-landing">
      <div className="footer-landing__box-info">
        <img src="/images/LandingPage/logo.png" alt="logo" />

        <div className="footer-landing__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
        <div>© 2022, Block Sniper</div>
      </div>

      <div className="footer-landing__menus">
        <div>Company</div>
        {menus.map((item) => {
          return (
            <Link className="footer-landing__menu-item" to={item.path}>
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="footer-landing__menus">
        <div>Privacy Policy and Terms of Service</div>
        {linkTerms.map((item) => {
          return (
            <Link className="footer-landing__menu-item" to={item.path}>
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
