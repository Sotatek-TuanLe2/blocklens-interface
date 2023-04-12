import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import wallet from 'src/store/wallet';
import transaction from 'src/store/transaction';
import user from 'src/store/user';
import metadata from 'src/store/metadata';
import configuration from 'src/store/configuration';

const rootReducer = combineReducers({
  wallet,
  transaction,
  user,
  metadata,
  configuration,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;

export default () => {
  return { store };
};
