import { FC } from 'react';
import React from 'react';
import BasePage from '../layouts/BasePage';
import AppIcon, { LIST_ICONS } from 'src/components/AppIcon';

const HomePage: FC = () => {
  return (
    <BasePage>
      Home Page
      <AppIcon icon={LIST_ICONS.ETHEREUM_BLUE} />
    </BasePage>
  );
};

export default HomePage;
