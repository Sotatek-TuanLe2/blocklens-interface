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
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Storage from 'src/utils/utils-storage';
import AppDetail from './pages/AppDetail';
import VerifyAccountPage from './pages/VerifyAccountPage';
import { useDispatch } from 'react-redux';
import ResetPasswordPage from './pages/ResetPasswordPage';
import WebhookDetail from './pages/WebhookDetail';
import MessagesHistory from './pages/MessagesHistoryPage';
import BillingPage from './pages/BillingPage';
import AccountPage from './pages/AccountPage';
import BillingInfoPage from './pages/BillingInfoPage';
import ContactUs from './pages/ContactUs';
import BillingHistory from './pages/BillingHistoryPage';
import AllActivitiesPage from './pages/AllActivitiesPage';
import TopUpPage from './pages/TopUp';
import AppSettingsPage from './pages/AppSettingsPage';
import WebhookSettingsPage from './pages/WebhookSettingsPage';
import { clearUser, getUser } from './store/user';
import { initMetadata } from './store/metadata';
import ModalSubmittingTransaction from './modals/ModalSubmittingTransaction';
import ModalFinishTransaction from './modals/ModalFinishTransaction';
import ModalSignatureRequired from './modals/ModalSignatureRequired';
import DashboardsPage from './pages/DashboardsPage';
import { ROUTES } from './utils/common';
import WorkspacePage from './pages/WorkspacePage';
import PublicWorkspacePage from './pages/PublicWorkspacePage';
import useOriginPath from '././hooks/useOriginPath';
import WebHookCreatePage from './pages/WebHookCreatePage';
import DashboardScreenShot from './pages/DashboardScreenShot';
import { Error404Page } from './pages/ErrorPages';

/**
 * Main App routes.
 */

const GUEST_PATH = [
  ROUTES.HOME,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.VERIFY_EMAIL,
  ROUTES.SIGN_UP,
  ROUTES.RESET_PASSWORD,
  ROUTES.DASHBOARD,
  ROUTES.QUERY,
];

export const PRIVATE_PATH = [
  ROUTES.MY_DASHBOARD,
  ROUTES.MY_QUERY,
  ROUTES.TRIGGERS,
  ROUTES.APP,
  ROUTES.WEBHOOKS,
  ROUTES.ACCOUNT,
  ROUTES.CREATE_WEBHOOK,
];

const Routes: FC<RouteComponentProps> = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const accessToken = Storage.getAccessToken();
  const location = useLocation();
  const { goWithOriginPath } = useOriginPath();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!accessToken) {
      dispatch(clearUser());
      if (!GUEST_PATH.some((path) => pathname.includes(path))) {
        goWithOriginPath(ROUTES.LOGIN, location.pathname);
      }
      return;
    }
    dispatch(getUser());
    dispatch(initMetadata());
  }, [accessToken]);

  return (
    <>
      <Switch>
        <PrivateRoute
          path={`${ROUTES.APP}/:id/settings`}
          component={AppSettingsPage}
        />
        <PublicRoute path={ROUTES.LOGIN} component={LoginPage} />
        <PublicRoute path={ROUTES.SIGN_UP} component={SignUpPage} />
        <PublicRoute path={ROUTES.VERIFY_EMAIL} component={VerifyAccountPage} />
        <PublicRoute
          path={ROUTES.FORGOT_PASSWORD}
          component={ForgotPasswordPage}
        />
        <PublicRoute
          path={ROUTES.RESET_PASSWORD}
          component={ResetPasswordPage}
        />
        <PrivateRoute path={ROUTES.ACCOUNT} component={AccountPage} />
        <PrivateRoute path={ROUTES.BILLING} component={BillingPage} />
        <PrivateRoute path={ROUTES.BILLING_INFO} component={BillingInfoPage} />
        <PrivateRoute
          path={ROUTES.BILLING_HISTORY}
          component={BillingHistory}
        />
        <PrivateRoute path={ROUTES.TOP_UP} component={TopUpPage} />
        <PrivateRoute
          path={`/webhook/:webhookId/activities/:id`}
          component={MessagesHistory}
        />
        <PrivateRoute
          path={`${ROUTES.WEBHOOKS}/:id/activities`}
          component={AllActivitiesPage}
        />
        <PrivateRoute
          path={`${ROUTES.WEBHOOKS}/:id/settings`}
          component={WebhookSettingsPage}
        />
        <PrivateRoute
          path={`${ROUTES.WEBHOOKS}/:id`}
          component={WebhookDetail}
        />
        <PrivateRoute
          path={'/create-webhook/:id'}
          component={WebHookCreatePage}
        />
        <PrivateRoute path={`${ROUTES.APP}/:id`} component={AppDetail} />
        <PrivateRoute path={`${ROUTES.TRIGGERS}`} component={HomePage} />
        <Route
          path={`${ROUTES.DASHBOARD}/:dashboardId?`}
          component={PublicWorkspacePage}
        />
        <Route
          path={`${ROUTES.QUERY}/:queryId?`}
          component={PublicWorkspacePage}
        />
        <PrivateRoute
          path={`${ROUTES.MY_DASHBOARD}/:dashboardId?`}
          component={WorkspacePage}
        />
        <PrivateRoute
          path={`${ROUTES.MY_QUERY}/:queryId?`}
          component={WorkspacePage}
        />
        <Route
          path={`${ROUTES.DASHBOARD_SCREENSHOT}/:dashboardId`}
          component={DashboardScreenShot}
        />
        <Route path={ROUTES.CREATE_WEBHOOK} component={WebHookCreatePage} />
        <Route path={ROUTES.CONTACT_US} component={ContactUs} />
        <Route exact path={ROUTES.HOME} component={DashboardsPage} />
        <Route path="*" component={Error404Page} />
        {/* <PrivateRoute path={'/'} component={HomePage} /> */}
      </Switch>
      <>
        <ModalSignatureRequired />
        <ModalSubmittingTransaction />
        <ModalFinishTransaction />
      </>
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
              pathname: ROUTES.HOME,
            }}
          />
        )
      }
    />
  );
};

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const accessToken = Storage.getAccessToken();
  const location = useLocation();
  const { generateLinkObject } = useOriginPath();

  return (
    <Route
      exact
      {...rest}
      render={(props) =>
        !!accessToken ? (
          <Component {...props} />
        ) : (
          <Redirect to={generateLinkObject(ROUTES.LOGIN, location.pathname)} />
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
