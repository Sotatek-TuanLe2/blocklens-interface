import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import AppAccordion from 'src/components/AppAccordion';
import 'src/styles/pages/PricingPage.scss';
import Footer from './Footer';
import Header from './Header';

const LIST_PACKAGE = [
  {
    NAME: 'STARTER',
    PRICE: '0',
    SERVICE: ['2 apps', '100 messages/day', 'All supported chains'],
    BADGE: '',
  },
  {
    NAME: 'BASIC',
    PRICE: '29',
    SERVICE: ['5 apps', '500 messages/day', 'All supported chains'],
    BADGE: '',
  },
  {
    NAME: 'GROWTH',
    PRICE: '119',
    SERVICE: ['7 apps', '2,500 messages/day', 'All supported chains'],
    BADGE: 'Popular',
  },
  {
    NAME: 'PROFESSIONAL',
    PRICE: '479',
    SERVICE: ['15 apps', '12,000 messages/day', 'All supported chains'],
    BADGE: '',
  },
];

const LIST_NETWORK = [
  {
    name: 'Mainnet, Testnet',
    free: 'true',
    starter: 'true',
    growth: 'true',
    professional: 'true',
  },
  {
    name: 'All supported chains',
    free: 'true',
    starter: 'true',
    growth: 'true',
    professional: 'true',
  },
  {
    name: 'Apps',
    free: '2',
    starter: '5',
    growth: '7',
    professional: '15',
  },
  {
    name: 'Daily messages',
    free: '100',
    starter: '500',
    growth: '2,500',
    professional: '12,000',
  },
];

const LIST_PLAN = [
  {
    name: 'STARTER',
    mainTestNet: 'Mainnet, TestNet',
    archiveDate: 'All supported chains',
    activeApps: '2 apps',
    messagesCount: '100 messsages/day',
    linkStarted: '/',
  },
  {
    name: 'BASIC',
    mainTestNet: 'Mainnet, TestNet',
    archiveDate: 'All supported chains',
    activeApps: '5 apps',
    messagesCount: '500 messsages/day',
    linkStarted: '/',
  },
  {
    name: 'GROWTH',
    mainTestNet: 'Mainnet, TestNet',
    archiveDate: 'All supported chains',
    activeApps: '7 apps',
    messagesCount: '2,500 messsages/day',
    linkStarted: '/',
  },
  {
    name: 'PROFESSIONAL',
    mainTestNet: 'Mainnet, TestNet',
    archiveDate: 'All supported chains',
    activeApps: '15 apps',
    messagesCount: '12,000 messsages/day',
    linkStarted: '/',
  },
];

const Pricing = () => {
  const [isFixedHeader, setIsFixedHeader] = useState<boolean>(false);

  const _renderPlanItem = () => (
    <>
      {LIST_PLAN.map((plan, index) => {
        return (
          <AccordionItem
            key={`${index} plan mobile`}
            className="content-plan-wrap"
          >
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton>
                    <Box
                      as="span"
                      flex="1"
                      textAlign="left"
                      fontWeight={700}
                      fontSize="18px"
                    >
                      {plan.name}
                    </Box>
                    {isExpanded ? (
                      <MinusIcon fontSize="12px" />
                    ) : (
                      <AddIcon fontSize="12px" />
                    )}
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={0}>
                  <div className="content-plan-item">
                    <div className="icon-tone"></div>
                    <span>{plan.mainTestNet}</span>
                  </div>
                  <div className="content-plan-item">
                    <div className="icon-tone"></div>
                    <span>{plan.archiveDate}</span>
                  </div>
                  <div className="content-plan-item">
                    <div className="icon-tone"></div>
                    <span>{plan.activeApps}</span>
                  </div>
                  <div className="content-plan-item">
                    <div className="icon-tone"></div>
                    <span>{plan.messagesCount}</span>
                  </div>
                  <div className="active-plan-btn">
                    <div>Get Started</div>
                    <div className="icon-vector-right"></div>
                  </div>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        );
      })}
    </>
  );
  const _renderPricePlan = (value: string) => {
    if (value === 'true') {
      return <div className="icon-tone"></div>;
    } else return <div>{value}</div>;
  };

  const _renderPlanComparisonMobile = () => {
    return (
      <AppAccordion content={_renderPlanItem} className="list-plan-mobile" />
    );
  };

  const _renderPlanConparisonDesktop = () => {
    return (
      <div className="plan-table">
        <div className="plan-row">
          <div className="name-plan-cell"></div>
          <div className="free-plan-cell title-plan">STARTER</div>
          <div className="starter-plan-cell title-plan">BASIC</div>
          <div className="growth-plan-cell title-plan">GROWTH</div>
          <div className="pro-plan-cell title-plan">PROFESSIONAL</div>
        </div>
        {LIST_NETWORK.map((plan, index) => {
          return (
            <div className="plan-row" key={`${index} plan`}>
              <div className="name-plan-cell">{plan.name}</div>
              <div className="free-plan-cell ">
                {_renderPricePlan(plan.free)}
              </div>
              <div className="starter-plan-cell ">
                {_renderPricePlan(plan.starter)}
              </div>
              <div className="growth-plan-cell ">
                {_renderPricePlan(plan.growth)}
              </div>
              <div className="pro-plan-cell ">
                {_renderPricePlan(plan.professional)}
              </div>
            </div>
          );
        })}
        <div className="plan-row">
          <div className="name-plan-cell"></div>
          <div className="free-plan-cell active-plan">
            <div>Get Started</div>
            <div className="icon-vector-right"></div>
          </div>
          <div className="starter-plan-cell active-plan">
            <div>Get Started</div> <div className="icon-vector-right"></div>
          </div>
          <div className="growth-plan-cell active-plan">
            <div>Get Started</div>

            <div className="icon-vector-right"></div>
          </div>
          <div className="pro-plan-cell active-plan">
            <div>Get Started</div>
            <div className="icon-vector-right"></div>
          </div>
        </div>
      </div>
    );
  };

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
          <div className={`list-package`}>
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
                    {item.PRICE !== '0' && <div className="currency-package">$</div>}
                    <div className="price-package">{item.PRICE === '0' ? 'FREE' : item.PRICE}</div>
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
          <h1 className="introduction__main-text price-text">
            <span>Plan</span> comparison
          </h1>
          {isMobile
            ? _renderPlanComparisonMobile()
            : _renderPlanConparisonDesktop()}

          <h1 className="introduction__main-text price-text">
            Want to learn more? <span>Contact us</span>
          </h1>
          <div className="button-network-wrap">
            <div className="button-network">
              <div className="icon-telegram"></div>
              <div>Telegram</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
