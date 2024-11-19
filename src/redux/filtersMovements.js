import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  facturas: true,
  pagos: true,
  notasCredito: true,
  devoluciones: true,
  descuentos: true,
  pageSize: 50,
  pending: true,
  page: 1,
  currentAcountId: null,
};

const filterMovementsSlice = createSlice({
  name: 'filtersMovements',
  initialState,
  reducers: {
    setFilterMovements: (state, action) => {
      console.log(action.payload);
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetFilterMovements: (state, action) => {
      state.facturas = true;
      state.pagos = true;
      state.notasCredito = true;
      state.devoluciones = true;
      state.descuentos = true;
      state.pageSize = 50;
      state.pending = true;
      state.page = 1;
      state.currentAcountId = null;
    },
  },
});

export const { setFilterMovements, resetFilterMovements } =
  filterMovementsSlice.actions;

export default filterMovementsSlice.reducer;
