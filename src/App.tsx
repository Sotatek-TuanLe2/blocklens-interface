import React from 'react';
import createRoutes from 'src/routes';
import theme from 'src/themes';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'src/store';
import 'src/styles/global.scss';
import 'react-loading-skeleton/dist/skeleton.css'

/* eslint-disable-next-line */
function App() {
  const { store } = configureStore();

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode="dark" />
        <React.StrictMode>
          <BrowserRouter>{createRoutes()}</BrowserRouter>
        </React.StrictMode>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
