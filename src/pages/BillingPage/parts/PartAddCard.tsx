import { Box, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import 'src/styles/pages/AppDetail.scss';
import FormCard from './FormCard';

interface IPartAddCard {
  onBack: () => void;
}

const PartAddCard: FC<IPartAddCard> = ({ onBack }) => {
  return (
    <Box className="form-card">
      <Flex alignItems={'center'} mb={7}>
        <Box className="icon-arrow-left" mr={6} onClick={onBack} />
        <Box className={'sub-title'}>Card</Box>
      </Flex>
      <FormCard />
    </Box>
  );
};

export default PartAddCard;
