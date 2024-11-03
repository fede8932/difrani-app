import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brand: null,
  article: null,
  description: null,
  columnOrder: "article",
  order: "asc",
  pageSize: 50,
  page: 1,
};

const filtersProductsSlice = createSlice({
  name: "filtersProducts",
  initialState,
  reducers: {
    setFilterProduct: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value ? value : null;
    },
    resetFilterProduct: (state, action) => {
      state.brand = null;
      state.article = null;
      state.description = null;
      state.columnOrder = "article";
      state.order = "asc";
      state.pageSize = 50;
      state.page = 1;
    },
  },
});

export const { setFilterProduct, resetFilterProduct } =
  filtersProductsSlice.actions;

export default filtersProductsSlice.reducer;
