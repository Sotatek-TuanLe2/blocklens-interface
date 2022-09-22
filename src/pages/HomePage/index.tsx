import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import BasePage from 'src/layouts/BasePage';
import 'src/styles/pages/HomePage.scss';
import FormCreateApp from './parts/FormCreateApp';
import ListApps from './parts/ListApps';

const HomePage = () => {
  const [searchListApp, setSearchListApp] = useState<any>({});
  return (
    <BasePage>
      <Box
        pt="70px"
        display={'flex'}
        alignItems="center"
        flexDirection={'column'}
      >
        <FormCreateApp setSearchListApp={setSearchListApp} />
        <ListApps searchListApp={searchListApp} />
      </Box>
    </BasePage>
  );
};

export default HomePage;
