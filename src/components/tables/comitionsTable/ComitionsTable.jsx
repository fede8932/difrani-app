import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertirFechaISOaDDMMYYYY,
  redondearADosDecimales,
} from '../../../utils';
import { Checkbox, Pagination, Select } from 'semantic-ui-react';
import styles from './comitionsTable.module.css';
import { useLocation } from 'react-router';
import { setFilterProduct } from '../../../redux/filtersProducts';
import {
  getResumeLiquidationRequest,
  getSellerResumeRequest,
  setMarc,
} from '../../../redux/sellerResume';
import { setFilterComis } from '../../../redux/filtersComis';

const CustomComp = ({ data }) => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(setMarc({ id: data.id }));
  };
  return (
    <div className={styles.buttonContainer}>
      <Checkbox
        disabled={data?.liquidada}
        onChange={onClick}
        checked={data?.marc}
      />
    </div>
  );
};

// const HeaderInput = (props) => {
//   const { title, name } = props;
//   const dispatch = useDispatch();
//   const filterProducts = useSelector((state) => state.filterProduct);
//   const [inp, setInp] = useState(false);
//   const inputRef = useRef(null);

//   const onTitleClick = () => {
//     setInp(true);
//   };
//   const onInputChange = (e) => {
//     const value = e.target.value;
//     dispatch(setFilterProduct({ name: "page", value: 1 }));
//     dispatch(setFilterProduct({ name, value }));
//     if (value == "") {
//       setInp(false);
//     }
//   };

//   const handleClickOutside = () => {
//     if (!filterProducts[name]) {
//       setInp(false);
//     }
//   };

//   useEffect(() => {
//     if (inp && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [inp]);

//   useEffect(() => {
//     if (inp) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [filterProducts, inp]);

//   return inp ? (
//     <input
//       ref={inputRef}
//       className={styles.input}
//       value={filterProducts[name]}
//       onChange={onInputChange}
//     />
//   ) : (
//     <span onClick={onTitleClick}>{title}</span>
//   );
// };

function ComitionsTable(props) {
  const { liqId } = props;
  const sellerId = Number(useLocation().pathname.split('/')[3]);
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'Fecha',
      valueGetter: (params) => convertirFechaISOaDDMMYYYY(params.data.fecha),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Concepto',
      valueGetter: (params) => params.data.concepto,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Cliente',
      valueGetter: (params) => params.data.cliente,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Monto',
      valueGetter: (params) => `$ ${redondearADosDecimales(params.data.monto)}`,
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Comisión',
      valueGetter: (params) =>
        `$ ${redondearADosDecimales(params.data.comision)}`,
      filter: false,
      flex: 1,
    },
  ];

  if (!liqId) {
    columnInitialState.push({
      headerName: 'Liquidada',
      cellRenderer: (params) => <CustomComp data={params.data} />,
      field: 'id',
      sortable: false,
      filter: false,
      flex: 1,
    });
  }

  const [columnDefs, setColumnDefs] = useState(columnInitialState);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  const { loading, error, data } = useSelector((state) => state.sellerResume);
  const [pending, setPending] = useState(true);

  // console.log(data);

  const filterCom = useSelector((state) => state.filterCom);

  const selectChange = (e, d) => {
    dispatch(setFilterComis({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterComis({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    let getData = { id: sellerId, pending: pending, ...filterCom };
    if (!liqId) {
      dispatch(getSellerResumeRequest(getData));
    } else {
      dispatch(getResumeLiquidationRequest({ liqId: liqId }));
    }
  }, [filterCom, pending]);

  return (
    <div
      className={'ag-theme-quartz'}
      style={!liqId ? { height: 600, marginTop: '-20px' } : { height: 520 }}
    >
      <Checkbox
        style={{ margin: '0px 0px 5px 0px' }}
        toggle
        label="Pendiente"
        checked={pending}
        onChange={(e, d) => setPending(d.checked)}
      />
      <AgGridReact
        rowData={data.registros}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      {!liqId ? (
        <div className={styles.paginationContainer}>
          <span>{`Se encontraron ${data.totalPages} páginas con ${data.totalResults} resultados.`}</span>
          <div className={styles.pagination}>
            <div style={{ marginRight: '10px' }}>
              <Select
                width="10px"
                defaultValue={filterCom.pageSize}
                onChange={selectChange}
                options={[
                  { key: 50, value: 50, text: 50 },
                  { key: 100, value: 100, text: 100 },
                  { key: 500, value: 500, text: 500 },
                ]}
              />
            </div>
            <Pagination
              boundaryRange={0}
              activePage={filterCom.page}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={data.totalPages}
              onPageChange={changePage}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ComitionsTable;
