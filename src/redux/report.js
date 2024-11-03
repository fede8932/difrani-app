import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as orderRequest from "../request/orderRequest";
const initState = {
  loading: false,
  data: [],
  error: "",
};
export const getReportRequest = createAsyncThunk(
  "GET_REPORT",
  orderRequest.getReport
);

const reportSlice = createSlice({
  name: "report",
  initialState: initState,
  extraReducers: {
    [getReportRequest.pending]: (state, action) => {
      state.loading = true;
    },
    [getReportRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getReportRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    },
  },
});

export default reportSlice.reducer;
