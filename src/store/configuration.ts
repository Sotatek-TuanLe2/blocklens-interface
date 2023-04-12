import { createSlice } from '@reduxjs/toolkit';

interface IOptionTable {
  alignContent: string;
  type: string;
  coloredPositive: boolean;
  coloredNegative: boolean;
}

const initialState: IOptionTable = {
  alignContent: 'left',
  type: 'normal',
  coloredPositive: false,
  coloredNegative: false,
};

const configureSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setAlignContent: (state, action) => {
      state.alignContent = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setColoredNegative: (state, action) => {
      state.coloredNegative = action.payload;
    },
    setColoredPositive: (state, action) => {
      state.coloredPositive = action.payload;
    },
  },
});
export const {
  setAlignContent,
  setType,
  setColoredNegative,
  setColoredPositive,
} = configureSlice.actions;
export default configureSlice.reducer;
