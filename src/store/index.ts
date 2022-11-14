import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import auth from 'src/store/auth';
import billing from 'src/store/billing-plan';

const rootReducer = combineReducers({
  auth,
  billing
});

const initialState = {};

const middlewares = [thunk];

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export default () => {
  return { store };
};
