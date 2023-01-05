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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Storage from 'src/utils/utils-storage';
import AppDetail from './pages/AppDetail';
import VerifyAccountPage from './pages/VerifyAccountPage';
import { useDispatch } from 'react-redux';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CreateWebhookPage from './pages/CreateWebhookPage';
import WebhookDetail from './pages/WebhookDetail';
import MessagesHistory from './pages/MessagesHistoryPage';
import BillingPage from './pages/BillingPage';
import AccountPage from './pages/AccountPage';
import BillingInfoPage from './pages/BillingInfoPage';
import LandingPage from './pages/LandingPage';
import Pricing from './pages/LandingPage/Pricing';
import ContactUs from './pages/ContactUs';
import BillingHistory from './pages/BillingHistoryPage';
import ModalSubmittingTransaction from './modals/ModalSubmittingTransaction';
import ModalFinishTransaction from './modals/ModalFinishTransaction';
import AllActivitiesPage from './pages/AllActivitiesPage';
import TopUpPage from './pages/TopUp';
import { getUser } from './store/user';
import { initMetadata } from './store/metadata';
import AppSettingsPage from './pages/AppSettingsPage';
import WebhookSettingsPage from './pages/WebhookSettingsPage';

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
    dispatch(getUser());
    dispatch(initMetadata());
  }, [accessToken]);

  return (
    <>
      <Switch>
        <PrivateRoute path={`/apps/:id/settings`} component={AppSettingsPage} />
        <PrivateRoute path={`/apps/:id`} component={AppDetail} />
        <PublicRoute path={'/login'} component={LoginPage} />
        <PublicRoute path={'/sign-up'} component={SignUpPage} />
        <PublicRoute path={'/verify-email'} component={VerifyAccountPage} />
        <PublicRoute path={'/forgot-password'} component={ForgotPasswordPage} />

        <PublicRoute path={'/reset-password'} component={ResetPasswordPage} />
        <PrivateRoute path={'/billing'} component={BillingPage} />
        <PrivateRoute path={'/account'} component={AccountPage} />
        <PrivateRoute path={'/billing-info'} component={BillingInfoPage} />
        <PrivateRoute path={'/billing-history'} component={BillingHistory} />
        <PrivateRoute
          path={'/app/:appId/webhooks/:id/activities'}
          component={AllActivitiesPage}
        />
        <PrivateRoute
          path={'/app/:appId/webhooks/:id/settings'}
          component={WebhookSettingsPage}
        />
        <PrivateRoute
          path={'/app/:appId/webhooks/:id'}
          component={WebhookDetail}
        />
        <PrivateRoute
          path={'/create-webhook/:id'}
          component={CreateWebhookPage}
        />
        <PrivateRoute
          path={'/app/:appId/webhook/:webhookId/activities/:id'}
          component={MessagesHistory}
        />
        <PrivateRoute path={'/home'} component={HomePage} />
        <Route path={'/pricing'} component={Pricing} />
        <PrivateRoute path={'/top-up'} component={TopUpPage} />
        <Route path={'/contact-us'} component={ContactUs} />
        <PublicRoute path={'/'} component={LandingPage} />
      </Switch>
      <ModalSubmittingTransaction />
      <ModalFinishTransaction />
    </>
  );
};

const PublicRoute = ({ component: Component, path, ...rest }: any) => {
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
              pathname: '/home',
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
      exact
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
