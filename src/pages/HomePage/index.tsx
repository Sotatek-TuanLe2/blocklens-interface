import React, { useState } from 'react';
import 'src/styles/pages/HomePage.scss';
import FormCreateApp from './parts/FormCreateApp';
import ListApps from './parts/ListApps';
import { BasePageContainer } from 'src/layouts';
import PartUserStats from './parts/PartUserStats';

const HomePage = () => {
  const [searchListApp, setSearchListApp] = useState<any>({});
  return (
    <BasePageContainer>
      <>
        <FormCreateApp setSearchListApp={setSearchListApp} />

        <PartUserStats />
        <ListApps
          searchListApp={searchListApp}
          setSearchListApp={setSearchListApp}
        />
      </>
    </BasePageContainer>
  );
};

export default HomePage;
