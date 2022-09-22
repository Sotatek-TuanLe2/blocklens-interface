import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Storage from 'src/utils/storage';
import rf from 'src/requests/RequestFactory';
import { deleteAuthorization } from 'src/utils/utils-auth';

interface IUserInfo {
  userId?: string;
  firstName?: string;
  isEmailVerified?: boolean;
  lastName?: string,
  address?: string
  email?: string
}

interface AuthenticationState {
  userInfo: IUserInfo,
}

const initialState = {
  userInfo: {},
} as AuthenticationState;

export const getInfoUser = createAsyncThunk(
  'myAccount/getUser',
  async (params, thunkApi) => {
    const res = await rf.getRequest('UserRequest').getInfoUser();
    thunkApi.dispatch(setUserInfo(res));
  },
);

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.userInfo = {};
      deleteAuthorization();
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action) => {
      Storage.setAccessToken(action.payload.accessToken);
      Storage.setRefreshToken(action.payload.refreshToken);
    },
  },
});

export const {
  clearAuth,
  setAccessToken,
  setUserInfo
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
