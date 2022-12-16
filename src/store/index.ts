import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import auth from 'src/store/auth';
import billing from 'src/store/billing';
import wallet from 'src/store/wallet';

const rootReducer = combineReducers({
  auth,
  billing,
  wallet
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware],
});

export type RootState = ReturnType<typeof store.getState>;

export default () => {
  return { store };
};
