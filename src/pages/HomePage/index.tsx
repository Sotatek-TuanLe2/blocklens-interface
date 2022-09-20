import { FC, useEffect, useRef, useState } from 'react';
import React from 'react';
import BasePage from 'src/layouts/BasePage';
import FormCreateApp from './parts/FormCreateApp';
import FormCreateWebHook from './parts/FormCreateWebHook';
import 'src/styles/pages/HomePage.scss';
import ListApps from './parts/ListApps';
import { DataTableRef } from 'src/components';

const HomePage = () => {
  const [searchListApp, setSearchListApp] = useState<any>({});
  return (
    <BasePage>
      <FormCreateApp setSearchListApp={setSearchListApp} />
      <ListApps searchListApp={searchListApp} />
      <FormCreateWebHook />
    </BasePage>
  );
};

export default HomePage;
