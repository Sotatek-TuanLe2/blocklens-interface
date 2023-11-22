import { ExternalProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import config from 'src/config';
import BaseConnector from 'src/connectors/BaseConnector';
import { getNetworkConfig, getNetworkProvider } from 'src/utils/utils-network';
import Storage from 'src/utils/utils-storage';
import { RootState } from '.';

interface IWalletState {
  network: string;
  chainId: string;
  connector: BaseConnector | null;
  provider: ExternalProvider | null;
  address: string;
  balance: string;
  isConnecting: boolean;
  openModalConnectWallet: boolean;
  openModalSignatureRequired: boolean;
}

const initialState: IWalletState = {
  network: Storage.getNetwork() || config.defaultNetwork,
  chainId:
    Storage.getChainId() ||
    String(getNetworkConfig(config.defaultNetwork)?.chainId),
  connector: null,
  provider: null,
  address: '',
  balance: '',
  isConnecting: false,
  openModalConnectWallet: false,
  openModalSignatureRequired: false,
};

export const getBalance = createAsyncThunk(
  'wallet/getBalance',
  async (_params, thunkApi) => {
    const { getState } = thunkApi;
    const {
      wallet: { network, connector, address },
    } = getState() as RootState;
    if (!address || !connector) {
      return '0';
    }
    const provider = getNetworkProvider(network);
    if (!provider) {
      return '0';
    }
    const balance = await provider.getBalance(address);
    return balance.toString();
  },
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setNetwork: (state, action) => {
      const network = action.payload || config.defaultNetwork;
      state.network = network;
      state.chainId = String(getNetworkConfig(network).chainId);
      Storage.setNetwork(state.network);
      Storage.setChainId(state.chainId);
    },
    setChainId: (state, action) => {
      state.chainId = String(action.payload);
      Storage.setChainId(state.chainId);
    },
    setConnector: (state, action) => {
      state.connector = action.payload;
      state.connector && Storage.setConnectorId(state.connector.getId());
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
      Storage.setAccountAddress(state.address);
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setIsConnecting: (state, action) => {
      state.isConnecting = action.payload;
    },
    setOpenModalConnectWallet: (state, action) => {
      state.openModalConnectWallet = action.payload;
    },
    setOpenModalSignatureRequired: (state, action) => {
      state.openModalSignatureRequired = action.payload;
    },
    clearWallet: () => {
      Storage.clearWallet();
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBalance.fulfilled, (state, action) => {
      state.balance = action.payload || '';
    });
  },
});

export const {
  setNetwork,
  setChainId,
  setConnector,
  setProvider,
  setAddress,
  setBalance,
  setIsConnecting,
  clearWallet,
  setOpenModalConnectWallet,
  setOpenModalSignatureRequired,
} = walletSlice.actions;
export default walletSlice.reducer;
