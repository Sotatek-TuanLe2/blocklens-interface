import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import 'src/styles/pages/PricingPage.scss';

const LIST_PACKAGE = [
  {
    NAME: 'FREE',
    PRICE: '0',
    SERVICE: ['5 Active apps', '10,000 messages/day'],
    BADGE: '',
  },
  {
    NAME: 'STARTER',
    PRICE: '50',
    SERVICE: ['10 Active apps', '100,000 messages/day'],
    BADGE: 'Popular',
  },
  {
    NAME: 'GROWTH',
    PRICE: '225',
    SERVICE: ['25 Active apps', '500,000 messages/day'],
    BADGE: 'Popular',
  },
  {
    NAME: 'PROFESSIONAL',
    PRICE: '1,000',
    SERVICE: ['50 Active apps', '2,500,000 messages/day'],
    BADGE: '',
  },
];

const Pricing = () => {
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
          <h1 className="introduction__main-text price-text">
            Industry-leading <span>plans</span>, built for everyone
          </h1>
          <div className="list-package">
            {LIST_PACKAGE.map((item, index) => {
              return (
                <div className="package" key={`${index} package`}>
                  {item.BADGE ? (
                    <div className="badge-package">{item.BADGE}</div>
                  ) : (
                    ''
                  )}
                  <div className="name-package">{item.NAME}</div>
                  <div className="price-package-wrap">
                    <div className="currency-package">$</div>
                    <div className="price-package">{item.PRICE}</div>
                    {item.PRICE !== '0' ? (
                      <div className="time-package">/mo</div>
                    ) : (
                      ''
                    )}
                  </div>
                  {item.SERVICE.map((content, index) => {
                    return (
                      <div className="service-package" key={`${index} service`}>
                        <div className="icon-tone"></div>{' '}
                        <div className="service-content">{content}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <h1 className="introduction__main-text price-text">
            Support the best <span>networks</span>
          </h1>
          <div className="network-support">
            <img
              src="/images/PricingPage/network-circle.png"
              alt="network circle"
            />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Pricing;
