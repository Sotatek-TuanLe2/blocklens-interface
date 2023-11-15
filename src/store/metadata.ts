import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';
import { RootState } from '.';
import { setInitialUserPlan } from './user';

export type MetadataPlan = {
  code: string;
  name: string;
  description: string;
  price: number;
  capacity: {
    cu: number;
    project: number | null;
  };
  rateLimit: {
    type: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY';
    limit: number;
  }[];
  subscribeOptions: {
    code?: string;
    discount?: number;
    numOfMonths?: number;
  }[];
  webhookRetry: number;
};

export type MetadataState = {
  plans: MetadataPlan[];
};

const initialState: MetadataState = {
  plans: [],
};

export const initMetadata = createAsyncThunk(
  'metadata/init',
  async (_params, thunkApi) => {
    thunkApi.dispatch(getMetadataPlans());
  },
);

export const getMetadataPlans = createAsyncThunk(
  'metadata/getPlans',
  async (_params, thunkApi) => {
    const res = await rf.getRequest('BillingRequest').getPlans();
    if (!!res && !!res.length) {
      thunkApi.dispatch(setPlans(res));

      const currentPlan = (thunkApi.getState() as RootState).user.billing.plan;
      // if user does not have subscription = free plan
      if (currentPlan.code === res[0].code) {
        thunkApi.dispatch(setInitialUserPlan(res[0]));
      }
    }
  },
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
  },
});

export const { setPlans } = metadataSlice.actions;

export default metadataSlice.reducer;
