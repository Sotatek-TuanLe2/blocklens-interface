import { FC } from 'react';
import React from 'react';
import BasePage from 'src/layouts/BasePage';
import FormCreateApp from './parts/FormCreateApp';
import FormCreateWebHook from './parts/FormCreateWebHook';

const HomePage: FC = () => {
  return (
    <BasePage>
      <FormCreateApp />
      <FormCreateWebHook />
    </BasePage>
  );
};

export default HomePage;
