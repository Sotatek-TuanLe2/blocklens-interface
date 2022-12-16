import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Storage from 'src/utils/utils-storage';
import rf from 'src/requests/RequestFactory';
import { setAuthorizationToRequest } from 'src/utils/utils-auth';

interface IUserInfo {
  userId?: string;
  firstName?: string;
  isEmailVerified?: boolean;
  lastName?: string;
  address?: string;
  email?: string;
}

interface AuthState {
  userInfo: IUserInfo;
}

const initialState = {
  userInfo: {},
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
      state.userInfo = {};
      setAuthorizationToRequest(null);
      Storage.logout();
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action) => {
      setAuthorizationToRequest(action.payload.accessToken);
      Storage.setAccessToken(action.payload.accessToken);
      Storage.setRefreshToken(action.payload.refreshToken);
    },
  },
});

export const { clearAuth, setAccessToken, setUserInfo } = authSlice.actions;

export default authSlice.reducer;
