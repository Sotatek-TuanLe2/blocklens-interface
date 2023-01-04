import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';
import { setAuthorizationToRequest } from 'src/utils/utils-auth';
import Storage from 'src/utils/utils-storage';

export type UserAuthType = {
  accessToken: string;
  refreshToken: string;
};

export type UserStatsType = {
  numberOfAddressActivities: number;
  numberOfContractActivities: number;
  numberOfNftActivities: number;
  totalApp: number;
  totalAppActive: number;
  totalAppInActive: number;
  totalRegistration: number;
  totalRegistrationActive: number;
};

export type UserInfoType = {
  email: string;
  isEmailVerified?: boolean;
  firstName: string;
  lastName: string;
  address?: string;
  billingEmail: string;
};

export type UserPlanType = {
  code: string;
  name: string;
  description: string;
  price: number;
  appLimitation: number;
  notificationLimitation: number;
  currency: string;
  from: number;
  to: number;
};

export interface StripePayment {
  card: any;
  id: string;
  livemode: boolean;
}

export type UserPaymentType = {
  isPaymentMethodIntegrated: boolean;
  activePaymentMethod: string;
  stripePaymentMethod: StripePayment;
  walletAddress: string;
  balance: number;
};

export type UserSettingsType = {
  notificationEnabled: boolean;
};

export type UserBillingType = {
  plan: UserPlanType;
  payment: UserPaymentType;
};

export type UserState = {
  userId: string;
  auth: UserAuthType;
  info: UserInfoType;
  stats: UserStatsType;
  billing: UserBillingType;
  settings: UserSettingsType;
};

const initialState: UserState = {
  userId: '',
  auth: {
    accessToken: Storage.getAccessToken() || '',
    refreshToken: Storage.getRefreshToken() || ''
  },
  info: {
    email: '',
    firstName: '',
    lastName: '',
    billingEmail: ''
  },
  stats: {
    numberOfAddressActivities: 0,
    numberOfContractActivities: 0,
    numberOfNftActivities: 0,
    totalApp: 0,
    totalAppActive: 0,
    totalAppInActive: 0,
    totalRegistration: 0,
    totalRegistrationActive: 0,
  },
  billing: {
    plan: {
      code: 'STARTER',
      name: 'STARTER',
      description: '',
      price: 0,
      currency: '',
      from: 0,
      to: 0,
      appLimitation: 0,
      notificationLimitation: 0
    },
    payment: {
      activePaymentMethod: 'STRIPE',
      balance: 0,
      isPaymentMethodIntegrated: false,
      stripePaymentMethod: {
        card: {},
        id: '',
        livemode: false
      },
      walletAddress: ''
    }
  },
  settings: {
    notificationEnabled: false
  }
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_params, thunkApi) => {
    thunkApi.dispatch(getUserProfile());
    thunkApi.dispatch(getUserStats());
    thunkApi.dispatch(getUserPlan());
  },
)

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
    const res = await rf.getRequest('AppRequest').getAppStatsOfUser();
    thunkApi.dispatch(setUserStats(res));
  },
);

export const getUserPlan = createAsyncThunk(
  'user/getUserPlan',
  async (_params, thunkApi) => {
    const res = await rf.getRequest('BillingRequest').getCurrentPlan();
    thunkApi.dispatch(setUserPlan(res));
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
      state.userId = action.payload.userId;
    },
    setUserAuth: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.auth = { accessToken, refreshToken };
      setAuthorizationToRequest(accessToken);
      Storage.setAccessToken(accessToken);
      Storage.setRefreshToken(refreshToken);
    },
    setUserInfo: (state, action) => {
      const {
        email,
        firstName,
        lastName,
        billingEmail
      } = action.payload;
      state.info = {
        email,
        firstName,
        lastName,
        billingEmail
      };
    },
    setUserStats: (state, action) => {
      state.stats = action.payload;
    },
    setUserPlan: (state, action) => {
      state.billing.plan = action.payload;
    },
    setUserPayment: (state, action) => {
      const {
        activePaymentMethod,
        balance,
        isPaymentMethodIntegrated,
        stripePaymentMethod,
        walletAddress
      } = action.payload;
      state.billing.payment = {
        activePaymentMethod,
        balance,
        isPaymentMethodIntegrated,
        stripePaymentMethod,
        walletAddress
      };
    },
    setUserSettings: (state, action) => {
      const { notificationEnabled } = action.payload;
      state.settings = { notificationEnabled };
    },
    clearUser: () => {
      setAuthorizationToRequest(null);
      Storage.logout();
      return initialState;
    }
  }
});

export const {
  setUserId,
  setUserAuth,
  setUserInfo,
  setUserStats,
  setUserPlan,
  setUserPayment,
  setUserSettings,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;