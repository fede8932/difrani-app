import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brand: null,
  article: null,
  description: null,
  columnOrder: "article",
  order: "asc",
  pageSize: 100,
  page: 1,
  equivalenceId: null,
  supplierId: null,
  sinImagen: false,
  orderBy: [],
};

const filtersProductsSlice = createSlice({
  name: "filtersProducts",
  initialState,
  reducers: {
    setOrderBy: (state, action) => {
      const { column, order } = action.payload;
      if (!order) {
        state.orderBy = [];
      } else {
        const orderList = [{ columnOrder: column, order: order }];
        state.orderBy = orderList;
      }
      state.page = 1;
    },
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
      state.columnOrder = "article";
      state.order = "asc";
      state.pageSize = 50;
      state.page = 1;
      state.equivalenceId = null;
      state.supplierId = null;
      state.sinImagen = false;
      state.orderBy = [];
    },
  },
});

export const {
  setFilterProduct,
  resetFilterProduct,
  setEquivFilter,
  resetEquivFilter,
  setOrderBy,
} = filtersProductsSlice.actions;

export default filtersProductsSlice.reducer;
