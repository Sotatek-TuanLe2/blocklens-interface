import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AppRequest from '../requests/AppRequest';

export type StatsOfUserType = {
  numberOfAddressActivities: number;
  numberOfContractActivities: number;
  numberOfNftActivities: number;
  totalApp: number;
  totalAppActive: number;
  totalAppInActive: number;
  totalRegistration: number;
  totalRegistrationActive: number;
};

type UserStatState = StatsOfUserType;

const initialState: UserStatState = {
  numberOfAddressActivities: 0,
  numberOfContractActivities: 0,
  numberOfNftActivities: 0,
  totalApp: 0,
  totalAppActive: 0,
  totalAppInActive: 0,
  totalRegistration: 0,
  totalRegistrationActive: 0,
};

export const getUserStats = createAsyncThunk(
  'stats/fetchUserStats',
  async () => {
    const appRequest = new AppRequest();
    return await appRequest.getAppStatsOfUser();
  },
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getUserStats.fulfilled, (state, action) => {
      return { ...action.payload };
    });
  },
});

const reducer = statsSlice.reducer;
export default reducer;
