import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import wallet from 'src/store/wallet';
import transaction from 'src/store/transaction';
import user2 from 'src/store/user-2';
import metadata from 'src/store/metadata';

const rootReducer = combineReducers({
  wallet,
  transaction,
  user2,
  metadata
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;

export default () => {
  return { store };
};
