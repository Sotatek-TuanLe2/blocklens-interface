import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';
import {
  setAuthorizationToRequest,
  setRecaptchaToRequest,
} from 'src/utils/utils-auth';
import Storage from 'src/utils/utils-storage';
import { parseJWT } from 'src/utils/utils-format';
import { MetadataPlan } from './metadata';

export type UserAuthType = {
  accessToken: string;
  refreshToken: string;
};

export type UserStatsType = {
  numberOfAddressActivities: number;
  numberOfContractActivities: number;
  numberOfNftActivities: number;
  totalProject: number;
  totalProjectActive: number;
  totalProjectInActive: number;
  totalRegistration: number;
  totalRegistrationActive: number;
  totalRegistrationActiveWithoutAppId: number;
  totalRegistrationWithoutAppId: number;
};

export type UserInfoType = {
  authProviders: string[];
  email: string;
  isEmailVerified?: boolean;
  firstName: string;
  lastName: string;
  address?: string;
};

export interface UserPlanType extends MetadataPlan {
  createdAt: string;
  updatedAt: string;
  currency: string;
  from: number;
  to: number;
  expireTime?: number;
}

export interface StripePayment {
  card: any;
  id: string;
  livemode: boolean;
}

export type UserPaymentType = {
  isPaymentMethodIntegrated: boolean;
  activePaymentMethod: string;
  stripePaymentMethod: StripePayment;
  walletAddresses: string[];
  balance: number;
};

export type UserSettingsType = {
  notificationEnabled: boolean;
  billingEmail?: string;
};

export type UserBillingType = {
  plan: UserPlanType;
  nextPlan: UserPlanType;
  payment: UserPaymentType;
};

export type UserState = {
  userId: string;
  auth: UserAuthType;
  info: UserInfoType;
  stats: UserStatsType;
  billing: UserBillingType;
  settings: UserSettingsType;
  isLoadingGetStatisticsUser: boolean;
};

const initialState: UserState = {
  userId: '',
  auth: {
    accessToken: Storage.getAccessToken() || '',
    refreshToken: Storage.getRefreshToken() || '',
  },
  info: {
    authProviders: [],
    email: '',
    firstName: '',
    lastName: '',
  },
  stats: {
    numberOfAddressActivities: 0,
    numberOfContractActivities: 0,
    numberOfNftActivities: 0,
    totalProject: 0,
    totalProjectActive: 0,
    totalProjectInActive: 0,
    totalRegistration: 0,
    totalRegistrationActive: 0,
    totalRegistrationActiveWithoutAppId: 0,
    totalRegistrationWithoutAppId: 0,
  },
  billing: {
    plan: {
      code: 'PLAN1',
      name: 'STARTER',
      description:
        'Features:\n    • 2 projects\n    • 100 messages/day\n    • 24/7 Telegram support (Response time < 72 hours)\n    ',
      price: 0,
      currency: '',
      from: 0,
      to: 0,
      capacity: {
        cu: 1000000,
        project: 2,
      },
      rateLimit: [],
      subscribeOptions: [],
      webhookRetry: 0,
      createdAt: '',
      updatedAt: '',
    },
    nextPlan: {
      code: 'PLAN1',
      name: 'STARTER',
      description:
        'Features:\n    • 2 projects\n    • 100 messages/day\n    • 24/7 Telegram support (Response time < 72 hours)\n    ',
      price: 0,
      currency: '',
      from: 0,
      to: 0,
      capacity: {
        cu: 1000000,
        project: 2,
      },
      rateLimit: [],
      subscribeOptions: [],
      webhookRetry: 0,
      createdAt: '',
      updatedAt: '',
    },
    payment: {
      activePaymentMethod: 'STRIPE',
      balance: 0,
      isPaymentMethodIntegrated: false,
      stripePaymentMethod: {
        card: {},
        id: '',
        livemode: false,
      },
      walletAddresses: [],
    },
  },
  settings: {
    notificationEnabled: false,
  },
  isLoadingGetStatisticsUser: false,
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_params, thunkApi) => {
    thunkApi.dispatch(getUserProfile());
    thunkApi.dispatch(getUserStats());
    thunkApi.dispatch(getUserPlan());
  },
);

export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_params, thunkApi) => {
    const res = await rf.getRequest('UserRequest').getInfoUser();
    thunkApi.dispatch(setUserProfile(res));
  },
);

export const getUserStats = createAsyncThunk(
  'user/getUserStats',
  async (_params, thunkApi) => {
    thunkApi.dispatch(setIsLoadingStat(true));
    const appStat = await rf.getRequest('AppRequest').getAppStatsOfUser();
    const webhookStat = await rf
      .getRequest('RegistrationRequest')
      .getWebhookWithoutAppStatsOfUser();
    thunkApi.dispatch(setIsLoadingStat(false));
    thunkApi.dispatch(
      setUserStats({
        ...appStat,
        totalRegistrationActiveWithoutAppId:
          webhookStat.totalRegistrationActive,
        totalRegistrationWithoutAppId: webhookStat.totalRegistration,
      }),
    );
  },
);

export const getUserPlan = createAsyncThunk(
  'user/getUserPlan',
  async (_params, thunkApi) => {
    try {
      const res = await rf
        .getRequest('BillingRequest')
        .getCurrentSubscription();
      if (!!res) {
        thunkApi.dispatch(setUserPlan(res));
      }
    } catch (error) {
      console.error(error);
    }
  },
);

export const setUserProfile = createAsyncThunk(
  'user/setUserProfile',
  async (user: any, thunkApi) => {
    thunkApi.dispatch(setUserId(user));
    thunkApi.dispatch(setUserInfo(user));
    thunkApi.dispatch(setUserPayment(user));
    thunkApi.dispatch(setUserSettings(user));
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload.id;
    },
    setUserAuth: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      const timeExpireToken = parseJWT(accessToken).exp * 1000;
      state.auth = { accessToken, refreshToken };
      setAuthorizationToRequest(accessToken);
      Storage.setAccessToken(accessToken, timeExpireToken);
      Storage.setRefreshToken(refreshToken);
    },
    setUserInfo: (state, action) => {
      const { authProviders, email, firstName, lastName } = action.payload;
      state.info = {
        authProviders,
        email,
        firstName,
        lastName,
      };
    },
    setUserStats: (state, action) => {
      state.stats = action.payload;
    },
    setInitialUserPlan: (state, action) => {
      state.billing.plan = action.payload;
      state.billing.nextPlan = action.payload;
    },
    setUserPlan: (state, action) => {
      state.billing.plan = {
        ...action.payload.subscribedPlan,
        expireTime: action.payload.expireTime,
      };
      state.billing.nextPlan = action.payload.nextSubscribePlan;
    },
    setIsLoadingStat: (state, action) => {
      state.isLoadingGetStatisticsUser = action.payload;
    },
    setUserPayment: (state, action) => {
      const {
        payment: { activePaymentMethod, walletAddresses },
        balance,
        isPaymentMethodIntegrated,
        stripe: { paymentMethod: stripePaymentMethod },
      } = action.payload;
      state.billing.payment = {
        activePaymentMethod,
        balance,
        isPaymentMethodIntegrated,
        stripePaymentMethod,
        walletAddresses,
      };
    },
    setUserSettings: (state, action) => {
      const { notificationEnabled, setting } = action.payload;
      state.settings = {
        notificationEnabled,
        billingEmail: setting.billingEmail,
      };
    },
    clearUser: () => {
      setAuthorizationToRequest(null);
      setRecaptchaToRequest(null);
      Storage.logout();
      return initialState;
    },
  },
});

export const {
  setUserId,
  setUserAuth,
  setUserInfo,
  setUserStats,
  setInitialUserPlan,
  setUserPlan,
  setUserPayment,
  setUserSettings,
  clearUser,
  setIsLoadingStat,
} = userSlice.actions;

export default userSlice.reducer;
