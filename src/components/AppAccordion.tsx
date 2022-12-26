import { Accordion } from '@chakra-ui/react';
import React from 'react';

interface IAppAccordion {
  content: () => JSX.Element;
  className?: string;
}

const AppAccordion: React.FC<IAppAccordion> = ({ content, className }) => {
  return (
    <Accordion allowMultiple className={`${className}`}>
      {content()}
    </Accordion>
  );
};

export const appAccordionStyle = {
  baseStyle: {
    container: {
      background:
        'linear-gradient(180deg, rgba(255, 255, 255, 0) -24.6%, rgba(34, 108, 255, 0.24) 100%)',
      border: '1px solid rgba(34, 108, 255, 0.3)',
      filter: 'drop-shadow(0px 10px 40px rgba(136, 225, 220, 0.08))',
      backdropFilter: 'blur(8px)',
      borderRadius: '26px',
      padding: '20px 20px',
    },
    button: {
      _focus: {
        boxShadow: 'none',
      },
    },
  },
};

export default AppAccordion;
