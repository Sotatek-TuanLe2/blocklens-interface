import { FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import { useLocation } from 'react-router';
import React from 'react';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Storage from 'src/utils/storage';
import AppDetail from './pages/AppDetail';

/**
 * Main App routes.
 */

const Routes: FC<RouteComponentProps> = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Switch>
        <Route path={'/login'} component={LoginPage} />
        <Route path={'/sign-up'} component={SignUpPage} />
        <Route path={'/reset-password'} component={ResetPasswordPage} />
        <PrivateRoute path={'/app-detail'} component={AppDetail} />
        <PrivateRoute path={'/'} component={HomePage} />
      </Switch>
    </>
  );
};

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const accessToken = Storage.getAccessToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        !!accessToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        )
      }
    />
  );
};

const RoutesHistory = withRouter(Routes);

const routing = function createRouting() {
  return (
    <>
      <Router>
        <RoutesHistory />
      </Router>
    </>
  );
};

/**
 * Wrap the app routes into router
 *
 * PROPS
 * =============================================================================
 * @returns {React.Node}
 */
export default routing;
