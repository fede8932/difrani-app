import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productRequest from '../request/productRequest';
const initState = {
  loading: false,
  data: null,
  error: '',
};
export const getProductIdRequest = createAsyncThunk(
  'PRODUCT_GET_ID',
  productRequest.getProductId
);

const selectProductSlice = createSlice({
  name: 'selectProduct',
  initialState: initState,
  reducers: {
    resetSelectProduct: (state) => {
      state.loading = false;
      state.data = null;
      state.error = '';
    },
  },
  extraReducers: {
    [getProductIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getProductIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getProductIdRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
  },
});

export const { resetSelectProduct } = selectProductSlice.actions;

export default selectProductSlice.reducer;
