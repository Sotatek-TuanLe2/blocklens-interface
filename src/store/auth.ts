import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Storage from 'src/utils/utils-storage';
import rf from 'src/requests/RequestFactory';
import { setAuthorizationToRequest } from 'src/utils/utils-auth';

interface IUserInfo {
  userId: string;
  firstName: string;
  isEmailVerified?: boolean;
  isPaymentMethodIntegrated: boolean;
  notificationEnabled: boolean;
  lastName: string;
  address?: string;
  email: string;
  billingEmail: string;
  balance: number;
  stripePaymentMethod: any;
  walletAddress: string;
  activePaymentMethod: string;
}

interface AuthState {
  userInfo: IUserInfo;
  tokens: {
    access: string;
    refresh: string;
  }
}

const initialState = {
  userInfo: {
    userId: '',
    email: '',
    firstName: '',
    lastName: '',
    billingEmail: '',
    stripePaymentMethod: {},
    activePaymentMethod: 'STRIPE',
    balance: 0,
    walletAddress: '',
    notificationEnabled: false,
    isPaymentMethodIntegrated: false
  },
  tokens: {
    access: '',
    refresh: ''
  }
} as AuthState;

export const getInfoUser = createAsyncThunk(
  'myAccount/getUser',
  async (params, thunkApi) => {
    const res = await rf.getRequest('UserRequest').getInfoUser();
    thunkApi.dispatch(setUserInfo(res));
  },
);

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.userInfo = initialState.userInfo;
      setAuthorizationToRequest(null);
      Storage.logout();
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.tokens = {
        access: accessToken,
        refresh: refreshToken
      };
      setAuthorizationToRequest(accessToken);
      Storage.setAccessToken(accessToken);
      Storage.setRefreshToken(refreshToken);
    },
  },
});

export const { clearAuth, setAccessToken, setUserInfo } = authSlice.actions;

export default authSlice.reducer;
