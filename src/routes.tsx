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
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Storage from 'src/utils/storage';
import AppDetail from './pages/AppDetail';
import VerifyAccountPage from './pages/VerifyAccountPage';
import WebhookActivitiesPage from './pages/WebhookActivitiesPage';
import { getInfoUser } from 'src/store/auth';
import { useDispatch } from 'react-redux';

/**
 * Main App routes.
 */

const Routes: FC<RouteComponentProps> = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<any>();
  const accessToken = Storage.getAccessToken();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!accessToken) return;
    dispatch(getInfoUser());
  }, []);

  return (
    <>
      <Switch>
        <PrivateRoute path={`/app-detail/:id`} component={AppDetail} />
        <PublicRoute path={'/login'} component={LoginPage} />
        <PublicRoute path={'/sign-up'} component={SignUpPage} />
        <PublicRoute path={'/verify-email'} component={VerifyAccountPage} />
        <PublicRoute path={'/reset-password'} component={ResetPasswordPage} />
        <PrivateRoute path={'/setting/:tab'} component={ProfilePage} />
        <PrivateRoute path={'/webhook-activities/:id'} component={WebhookActivitiesPage} />
        <PrivateRoute path={'/'} component={HomePage} />
      </Switch>
    </>
  );
};

const PublicRoute = ({ component: Component, ...rest }: any) => {
  const accessToken = Storage.getAccessToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        !accessToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
            }}
          />
        )
      }
    />
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
