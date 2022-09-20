import { createSlice } from '@reduxjs/toolkit';
import Storage from 'src/utils/storage';

interface IUserInfo {
  userId?: string;
  firstName?: string;
  isEmailVerified?: boolean;
  lastName?: string,
  address?: string
}

interface AuthenticationState {
  userInfo: IUserInfo,
  accessToken: string
  refreshToken: string
}

const initialState = {
  userInfo: {},
  accessToken: ''
} as AuthenticationState;

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.userInfo = {};
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action) => {
      state = action.payload;
      Storage.setAccessToken(state.accessToken);
      Storage.setRefreshToken(state.refreshToken);
    },
  },
});

export const {
  clearAuth,
  setAccessToken,
  setUserInfo
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
