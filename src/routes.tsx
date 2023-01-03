import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import { clearAuth, getInfoUser } from 'src/store/auth';
import { getMyPlan, getPlans } from 'src/store/billing';
import Storage from 'src/utils/utils-storage';
import ModalFinishTransaction from './modals/ModalFinishTransaction';
import ModalSubmittingTransaction from './modals/ModalSubmittingTransaction';
import AccountPage from './pages/AccountPage';
import AppDetail from './pages/AppDetail';
import BillingHistory from './pages/BillingHistoryPage';
import BillingInfoPage from './pages/BillingInfoPage';
import BillingPage from './pages/BillingPage';
import ContactUs from './pages/ContactUs';
import CreateWebhookPage from './pages/CreateWebhookPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import Pricing from './pages/LandingPage/Pricing';
import LoginPage from './pages/LoginPage';
import MessagesHistory from './pages/MessagesHistoryPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignUpPage from './pages/SignUpPage';
import TopUpPage from './pages/TopUp';
import VerifyAccountPage from './pages/VerifyAccountPage';
import WebhookActivitiesPage from './pages/WebhookActivitiesPage';
import WebhookDetail from './pages/WebhookDetail';
import { getUserStats } from './store/user';

/**
 * Main App routes.
 */

const Routes: FC<RouteComponentProps> = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<any>();
  const accessToken = Storage.getAccessToken();
  const history = useHistory();
  const isExpireTimeToken =
    Storage.getExpireTimeToken() &&
    new Date().getTime() >= Number(Storage.getExpireTimeToken());
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!accessToken || isExpireTimeToken) {
      dispatch(clearAuth());
      history.push('/login');
      return;
    }
    dispatch(getInfoUser());
    dispatch(getMyPlan());
    dispatch(getPlans());
    dispatch(getUserStats());
  }, [accessToken]);

  return (
    <>
      <Switch>
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
          component={WebhookActivitiesPage}
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
