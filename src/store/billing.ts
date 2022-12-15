import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';

export interface IMyPlan {
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  from?: number;
  to?: number;
  appLimitation?: number;
  notificationLimitation?: number;
}

export interface IPlan {
  code: string;
  name: string;
  description?: string;
  price: number | null;
  currency?: string;
  periodByDay?: number;
  appLimitation?: number | string;
  notificationLimitation?: number | string;
  from?: number;
  to?: number;
}

interface BillingState {
  myPlan: IMyPlan;
  plans: IPlan[];
  billingInfos: any;
}

const initialState = {
  myPlan: {},
  plans: [],
  billingInfos: {},
} as BillingState;

export const getMyPlan = createAsyncThunk(
  'billing/getMyPlan',
  async (params, thunkApi) => {
    const res = await rf.getRequest('BillingRequest').getCurrentPlan();
    thunkApi.dispatch(setMyPlan(res));
  },
);

export const getPlans = createAsyncThunk(
  'billing/getPlans',
  async (params, thunkApi) => {
    const res = await rf.getRequest('BillingRequest').getPlans();
    thunkApi.dispatch(setPlans(res));
  },
);

export const getBillingInfos = createAsyncThunk(
  'billing/getBillingInfos',
  async (params, thunkApi) => {
    const res = await rf.getRequest('BillingRequest').getBillingInfo();
    thunkApi.dispatch(setBillingInfos(res));
  },
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setMyPlan: (state, action) => {
      state.myPlan = action.payload;
    },
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    setBillingInfos: (state, action) => {
      state.billingInfos = action.payload;
    },
  },
});

export const { setMyPlan, setPlans, setBillingInfos } = billingSlice.actions;

export default billingSlice.reducer;
