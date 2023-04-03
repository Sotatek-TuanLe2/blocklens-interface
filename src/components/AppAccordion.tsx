import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import 'src/styles/components/AppAccordion.scss';

interface IAppAccordion {
  title: string;
  content: JSX.Element;
  className?: string;
}

const AppAccordion: React.FC<IAppAccordion> = ({
  content,
  className,
  title,
}) => {
  return (
    <Accordion allowMultiple className={`${className} main-accordion`}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {title}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>{content}</AccordionPanel>
      </AccordionItem>
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
