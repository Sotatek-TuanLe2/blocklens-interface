import { Interface as AbiInterface } from '@ethersproject/abi';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Contract } from 'ethers';
import { toastError, toastSuccess } from 'src/utils/utils-notify';

interface ITransactionState {
  openSubmittingTransactionModal: boolean;
  openFinishTransactionModal: boolean;
}

export interface ITransactionParams {
  contractAddress: string;
  abi: AbiInterface;
  action: string;
  transactionArgs: any[];
  overrides?: any;
}

const initialState: ITransactionState = {
  openSubmittingTransactionModal: false,
  openFinishTransactionModal: false,
};

const GAS_LIMIT_BUFFER = 0.1;
const DEFAULT_CONFIRMATION = 5;

const TRANSACTION_ERROR_CODES = {
  UNPREDICTABLE_GAS_LIMIT: 'UNPREDICTABLE_GAS_LIMIT',
  ACTION_REJECTED: 'ACTION_REJECTED',
};

const createTransaction = async (provider: any, params: ITransactionParams) => {
  const {
    contractAddress,
    abi,
    action,
    transactionArgs,
    overrides = {},
  } = params;
  const contractWithSigner = new Contract(
    contractAddress,
    abi,
    new Web3Provider(provider).getSigner(),
  );
  // Gas estimation
  const gasLimitNumber = await contractWithSigner.estimateGas[action](
    ...transactionArgs,
    overrides,
  );
  const gasLimit = gasLimitNumber.toNumber();
  overrides.gasLimit = Math.floor(gasLimit * (1 + GAS_LIMIT_BUFFER));
  return contractWithSigner[action](...transactionArgs, overrides);
};

const handleTransaction = createAsyncThunk(
  'transaction/handleTransaction',
  async (
    transactionParams: {
      transaction: any;
      provider: any;
      confirmation?: number;
    },
    thunkApi,
  ) => {
    const { dispatch } = thunkApi;
    const {
      transaction,
      provider,
      confirmation = DEFAULT_CONFIRMATION,
    } = transactionParams;
    try {
      if (transaction.hash) {
        dispatch(toggleSubmittingTransactionModal(true));
        const receipt = await new Web3Provider(provider).waitForTransaction(
          transaction.hash,
          confirmation,
        );
        dispatch(toggleSubmittingTransactionModal(false));

        if (receipt.status === 1) {
          dispatch(toggleFinishTransactionModal(true));
          toastSuccess({ message: 'Transaction completed successfully!' });
        } else {
          throw new Error("Transaction's gone wrong!");
        }
      }
    } catch (error: any) {
      throw new Error(error);
    }
  },
);

export const executeTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (
    transactionParams: {
      provider: any;
      params: ITransactionParams;
      confirmation?: number;
    },
    thunkApi,
  ) => {
    const { dispatch } = thunkApi;
    const {
      provider,
      params,
      confirmation = DEFAULT_CONFIRMATION,
    } = transactionParams;
    try {
      const transaction = await createTransaction(provider, params);
      await dispatch(
        handleTransaction({ transaction, provider, confirmation }),
      );
      return transaction;
    } catch (error: any) {
      switch (error.code) {
        case TRANSACTION_ERROR_CODES.UNPREDICTABLE_GAS_LIMIT:
          toastError({
            message: 'Insufficient balance. Please check your balance!',
          });
          break;
        case TRANSACTION_ERROR_CODES.ACTION_REJECTED:
          toastError({ message: 'User denied transaction signature.' });
          break;
        default:
          break;
      }
      throw new Error(error);
    }
  },
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    toggleSubmittingTransactionModal: (state, action) => {
      state.openSubmittingTransactionModal = action.payload;
    },
    toggleFinishTransactionModal: (state, action) => {
      state.openFinishTransactionModal = action.payload;
    },
  },
});

export const {
  toggleSubmittingTransactionModal,
  toggleFinishTransactionModal,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
