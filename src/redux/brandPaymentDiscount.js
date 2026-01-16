import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as brandPaymentDiscountRequest from '../request/brandPaymentDiscountRequest';

const initState = {
  loading: false,
  list: [],
  error: '',
};

export const getBrandPaymentDiscountsRequest = createAsyncThunk(
  'GET_BRAND_PAYMENT_DISCOUNTS',
  brandPaymentDiscountRequest.getDiscountsByBrand
);

export const newBrandPaymentDiscountRequest = createAsyncThunk(
  'NEW_BRAND_PAYMENT_DISCOUNT',
  brandPaymentDiscountRequest.createBrandPaymentDiscount
);

export const toggleBrandPaymentDiscountRequest = createAsyncThunk(
  'TOGGLE_BRAND_PAYMENT_DISCOUNT',
  brandPaymentDiscountRequest.toggleBrandPaymentDiscount
);

export const deleteBrandPaymentDiscountRequest = createAsyncThunk(
  'DELETE_BRAND_PAYMENT_DISCOUNT',
  brandPaymentDiscountRequest.deleteBrandPaymentDiscount
);

const brandPaymentDiscountSlice = createSlice({
  name: 'brandPaymentDiscount',
  initialState: initState,
  reducers: {
    resetBrandPaymentDiscount: (state) => {
      state.loading = false;
      state.error = '';
      state.list = [];
    },
  },
  extraReducers: {
    [getBrandPaymentDiscountsRequest.pending]: (state) => {
      state.loading = true;
    },
    [getBrandPaymentDiscountsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getBrandPaymentDiscountsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.list = action.payload || [];
      state.error = '';
    },
    [newBrandPaymentDiscountRequest.pending]: (state) => {
      state.loading = true;
    },
    [newBrandPaymentDiscountRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newBrandPaymentDiscountRequest.fulfilled]: (state, action) => {
      state.loading = false;
      // Store backend error if present
      if (action.payload?.error) {
        state.error = action.payload.error;
      } else {
        state.error = '';
      }
    },
    [toggleBrandPaymentDiscountRequest.pending]: (state) => {
      state.loading = true;
    },
    [toggleBrandPaymentDiscountRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [toggleBrandPaymentDiscountRequest.fulfilled]: (state, action) => {
      state.loading = false;
      const id = action.payload;
      const updated = state.list.map((item) => {
        if (item.id == id) {
          return { ...item, active: !item.active };
        }
        return item;
      });
      state.list = updated;
      state.error = '';
    },
    [deleteBrandPaymentDiscountRequest.pending]: (state) => {
      state.loading = true;
    },
    [deleteBrandPaymentDiscountRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deleteBrandPaymentDiscountRequest.fulfilled]: (state, action) => {
      state.loading = false;
      const id = action.payload;
      state.list = state.list.filter((item) => item.id != id);
      state.error = '';
    },
  },
});

export const { resetBrandPaymentDiscount } = brandPaymentDiscountSlice.actions;

export default brandPaymentDiscountSlice.reducer;
