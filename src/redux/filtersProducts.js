import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brand: null,
  article: null,
  description: null,
  columnOrder: 'article',
  order: 'asc',
  pageSize: 50,
  page: 1,
  equivalenceId: null,
};

const filtersProductsSlice = createSlice({
  name: 'filtersProducts',
  initialState,
  reducers: {
    setFilterProduct: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
    setEquivFilter: (state, action) => {
      state.brand = null;
      state.article = null;
      state.description = null;
      state.equivalenceId = action.payload;
    },
    resetEquivFilter: (state) => {
      state.equivalenceId = null;
    },
    resetFilterProduct: (state, action) => {
      state.brand = null;
      state.article = null;
      state.description = null;
      state.columnOrder = 'article';
      state.order = 'asc';
      state.pageSize = 50;
      state.page = 1;
      state.equivalenceId = null;
    },
  },
});

export const {
  setFilterProduct,
  resetFilterProduct,
  setEquivFilter,
  resetEquivFilter,
} = filtersProductsSlice.actions;

export default filtersProductsSlice.reducer;
