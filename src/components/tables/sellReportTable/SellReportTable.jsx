import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Select } from 'semantic-ui-react';
import styles from './sellReportTable.module.css';
import {
  resetFilterReport,
  setFilterReport,
} from '../../../redux/filtersSellReports';

function SellReportTable() {
  const dispatch = useDispatch();
  const listReport = useSelector((state) => state.report);

  const filtersReports = useSelector((state) => state.filterSellReport);

  const { totalPages, totalRows, list } = listReport.data;
  // console.log(list);

  let columnInitialState = [
    {
      headerName: 'Código',
      valueGetter: ({ data }) => data.product?.article,
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Descripción',
      valueGetter: ({ data }) => data.product?.description,
      flex: 5,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Marca',
      valueGetter: ({ data }) => data.brand?.name,
      flex: 2,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Cantidad',
      valueGetter: ({ data }) => data.amount,
      filter: false,
      flex: 1,
    },
  ];

  const [columnDefs, setColumnDefs] = useState(columnInitialState);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  const selectChange = (e, d) => {
    dispatch(setFilterReport([{ name: 'pageSize', value: d.value }]));
  };
  const changePage = (e, d) => {
    dispatch(setFilterReport([{ name: 'page', value: d.activePage }]));
  };

  useEffect(() => {
    return () => {
      dispatch(resetFilterReport(null));
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 600, marginTop: '-10px' }}
    >
      <AgGridReact
        rowData={list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${totalPages} páginas con ${totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filtersReports.pageSize}
              onChange={selectChange}
              options={[
                { key: 20, value: 20, text: 20 },
                { key: 50, value: 50, text: 50 },
                { key: 100, value: 100, text: 100 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filtersReports.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default SellReportTable;
