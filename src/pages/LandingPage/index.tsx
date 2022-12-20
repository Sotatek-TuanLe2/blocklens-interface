import 'src/styles/pages/LandingPage.scss';
import Header from 'src/pages/LandingPage/Header';
import Footer from 'src/pages/LandingPage/Footer';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

const categories = [
  {
    name: 'Push notifications',
    description:
      'Notify users of critical events at every step of their journey. Increase user engagement and retention by 100%.',
    image: 'push-notifications.png',
  },
  {
    name: 'Advanced events',
    description:
      'Not just address and NFT, Block Sniper allows developers to upload their smart contract ABI and specify which one to listen to.',
    image: 'advanced-events.png',
  },
  {
    name: 'Simple integration',
    description:
      'Create a new web hook with 1 click and start getting on-chain updates instantly.',
    image: 'simple-integration.png',
  },
];

const useCases = [
  {
    name: '1. Address transactions',
    description:
      'Notify users of critical events at every step of their journey. Increase user engagement and retention by 100%.',
    image: 'use-case-1.png',
  },
  {
    name: '2. Smart contract transactions',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    image: 'use-case-2.png',
  },
  {
    name: '3. NFT activities',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    image: 'use-case-3.png',
  },
  {
    name: '4. Failed transactions',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    image: 'use-case-4.png',
  },
];

const feedbacks = [
  {
    name: 'Name',
    title: 'Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
  },
  {
    name: 'Name',
    title: 'Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
  },
  {
    name: 'Name',
    title: 'Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
      ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
  },
];

const LandingPage = () => {
  const [isFixedHeader, setIsFixedHeader] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixedHeader(window.scrollY > 96);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <Header isFixedHeader={isFixedHeader} />

      <div className="main-landing">
        <div className="introduction">
          <div className="introduction__sub-text">
            Notifications for Web3.0 Developers
          </div>
          <h1 className="introduction__main-text">
            Listen to <span>on-chain</span> activities
          </h1>
          <div className="introduction__description">
            Block Sniper pushes on-chain events to your back-end web hooks.
            Reliable, configurable, real-time. Get started for free now!
          </div>

          <div className="introduction__btn">
            <button className="btn-primary">Get Started</button>
          </div>

          <div className="image-main">
            <img src="/images/LandingPage/main-image.png" alt="logo" />
          </div>

          <div className="categories">
            {categories.map((item, index) => {
              return (
                <div key={index}>
                  <div className="category">
                    <div>
                      <div className="category__name">{item.name}</div>
                      <div className="category__description">
                        {item.description}
                      </div>
                    </div>
                    <img
                      src={`/images/LandingPage/${item.image}`}
                      alt={`category-${index}`}
                    />
                  </div>
                  <div className="divider"></div>
                </div>
              );
            })}
          </div>

          <div className="use-cases">
            <h1 className="use-cases__title">
              Use <span>cases</span>
            </h1>
            <div>
              {useCases.map((item, index: number) => {
                return (
                  <div key={index}>
                    <div
                      className={`use-case ${
                        (index + 2) % 2 && !isMobile ? 'reverse' : ''
                      }`}
                    >
                      <div className="use-case__content">
                        <div className="use-case__name">{item.name}</div>
                        <div className="use-case__description">
                          {item.description}
                        </div>
                      </div>
                      <img
                        src={`/images/LandingPage/${item.image}`}
                        alt={`use-case-${index}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart">
            <div className="chart__description">
              <span>Blockchain made simple.</span> Remove the hassle of syncing
              and maintaining data/transactions between on-chain and off-chain.
              No full-node setup, no code, multi-chain.
            </div>

            <img src="/images/LandingPage/chart.png" alt="chart" />
          </div>

          <div className="feedback">
            <h1 className="feedback__heading">
              What other <br />
              <span>developers</span> say
            </h1>

            <div className="feedback__content">
              <div className="feedback__list">
                {feedbacks.map((item, index) => {
                  return (
                    <div className="feedback__item" key={index}>
                      <div className="feedback__description">
                        {item.description}
                      </div>
                      <div className="feedback__name">{item.name}</div>
                      <div className="feedback__title">{item.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="get-start">
            <h1 className="get-start__heading">
              Get <span> started </span> now
            </h1>
            <div className="get-start__description">
              Block Sniper gives you, the developers, the UX you demand and
              deserve, with no custom code.
            </div>

            <div className="get-start__btn">
              <Link to={'/sign-up'}>
                <button className="btn-primary">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
