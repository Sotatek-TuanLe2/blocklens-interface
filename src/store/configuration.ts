import { createSlice } from '@reduxjs/toolkit';

interface IOptionTable {
  columnData: any[];
  dataTable: any[];
}

const initialState: IOptionTable = {
  columnData: [],
  dataTable: [],
};

const configureSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setColumn: (state, action) => {
      state.columnData = action.payload;
    },
    setDataTable: (state, action) => {
      state.dataTable = action.payload;
    },

    updateDatTable: (state, action) => {
      const { newData } = action.payload;
      state.columnData = state.columnData.map((item) =>
        item.id === newData.id ? newData : item,
      );
    },
  },
});
export const { setColumn, updateDatTable, setDataTable } =
  configureSlice.actions;
export default configureSlice.reducer;
