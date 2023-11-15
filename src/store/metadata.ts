import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';

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
    duration: number;
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
    thunkApi.dispatch(setPlans(res));
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
