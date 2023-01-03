import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';

export type MetadataPlans = {
  code: string;
  name: string;
  description: string;
  price: number;
  appLimitation: number;
  notificationLimitation: number;
}

export type MetadataState = {
  plans: MetadataPlans[];
};

const initialState: MetadataState = {
  plans: []
};

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