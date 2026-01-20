import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentDiscountRequest from '../request/paymentDiscountRequest';

const initState = {
  loading: false,
  list: [],
  error: '',
};

export const getPaymentDiscountsRequest = createAsyncThunk(
  'GET_PAYMENT_DISCOUNTS',
  paymentDiscountRequest.getAllPaymentDiscounts
);

export const newPaymentDiscountRequest = createAsyncThunk(
  'NEW_PAYMENT_DISCOUNT',
  paymentDiscountRequest.createPaymentDiscount
);

export const togglePaymentDiscountRequest = createAsyncThunk(
  'TOGGLE_PAYMENT_DISCOUNT',
  paymentDiscountRequest.togglePaymentDiscount
);

export const deletePaymentDiscountRequest = createAsyncThunk(
  'DELETE_PAYMENT_DISCOUNT',
  paymentDiscountRequest.deletePaymentDiscount
);

const paymentDiscountSlice = createSlice({
  name: 'paymentDiscount',
  initialState: initState,
  reducers: {
    resetPaymentDiscount: (state) => {
      state.loading = false;
      state.error = '';
      state.list = [];
    },
  },
  extraReducers: {
    [getPaymentDiscountsRequest.pending]: (state) => {
      state.loading = true;
    },
    [getPaymentDiscountsRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getPaymentDiscountsRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.list = action.payload || [];
      state.error = '';
    },
    [newPaymentDiscountRequest.pending]: (state) => {
      state.loading = true;
    },
    [newPaymentDiscountRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [newPaymentDiscountRequest.fulfilled]: (state, action) => {
      state.loading = false;
      // Store backend error if present
      if (action.payload?.error) {
        state.error = action.payload.error;
      } else {
        state.error = '';
      }
    },
    [togglePaymentDiscountRequest.pending]: (state) => {
      state.loading = true;
    },
    [togglePaymentDiscountRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [togglePaymentDiscountRequest.fulfilled]: (state, action) => {
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
    [deletePaymentDiscountRequest.pending]: (state) => {
      state.loading = true;
    },
    [deletePaymentDiscountRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [deletePaymentDiscountRequest.fulfilled]: (state, action) => {
      state.loading = false;
      const id = action.payload;
      state.list = state.list.filter((item) => item.id != id);
      state.error = '';
    },
  },
});

export const { resetPaymentDiscount } = paymentDiscountSlice.actions;
export default paymentDiscountSlice.reducer;
