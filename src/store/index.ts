import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import auth from 'src/store/auth';
import billing from 'src/store/billing';
import wallet from 'src/store/wallet';
import transaction from 'src/store/transaction';
import stats from 'src/store/stats';

const rootReducer = combineReducers({
  auth,
  billing,
  wallet,
  transaction,
  stats,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;

export default () => {
  return { store };
};
