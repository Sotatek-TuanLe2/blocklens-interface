import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import rf from 'src/requests/RequestFactory';

interface billingPlanState {
  paymentIntent?: any;
}

const initialState: billingPlanState = {
  paymentIntent: {},
};

export const getPaymentIntent = createAsyncThunk(
  'billingPlan/getPaymentIntent',
  async () => {
    return await rf.getRequest('BillingRequest').getPaymentIntent();
  },
);

const billingPlanPlanSlice = createSlice({
  name: 'billingPlan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getPaymentIntent.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.paymentIntent = action.payload;
      },
    );
  },
});

export const {} = billingPlanPlanSlice.actions;

export default billingPlanPlanSlice.reducer;
