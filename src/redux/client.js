import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as clientRequest from '../request/clientRequest';
const userState = {
  loading: false,
  data: null,
  error: '',
};
export const clientCreateRequest = createAsyncThunk(
  'CLIENT_CREATE',
  clientRequest.clientRegister
);

export const getClientRequest = createAsyncThunk(
  'GET_CLIENT',
  clientRequest.getClients
);
export const getClientIdRequest = createAsyncThunk(
  'GET_CLIENT_ID',
  clientRequest.getClientById
);

export const getAllClientRequest = createAsyncThunk(
  'GET_ALL_CLIENT',
  clientRequest.getAllClients
);

export const resetAllClientRequest = createAsyncThunk(
  'RESET_ALL_CLIENT',
  () => userState
);

const clientSlice = createSlice({
  name: 'client',
  initialState: userState,
  extraReducers: {
    [clientCreateRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [clientCreateRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [clientCreateRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getClientRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getAllClientRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAllClientRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [getClientIdRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getClientIdRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getClientIdRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = '';
      state.data = action.payload;
    },
    [resetAllClientRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [resetAllClientRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [resetAllClientRequest.fulfilled]: (state, action) => {
      state.loading = action.payload.loading;
      state.data = action.payload.data;
      state.error = action.payload.error;
    },
  },
});

export default clientSlice.reducer;
