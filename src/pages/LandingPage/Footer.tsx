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
          Block Sniper pushes on-chain events to your back-end web hooks.
          Reliable, configurable, real-time. Get started for free now!
        </div>
        <div className="footer-landing__name">© 2022, Block Sniper</div>
      </div>

      <div className="footer-landing__menus-link">
        <div className="footer-landing__menus">
          <div>Company</div>
          {menus.map((item, index) => {
            return (
              <Link
                className="footer-landing__menu-item"
                to={item.path}
                key={index}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="footer-landing__menus">
          {linkTerms.map((item, index) => {
            return (
              <Link
                className="footer-landing__menu-item"
                to={item.path}
                key={index}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
