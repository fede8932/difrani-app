import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logoBlase from '../../../assets/logo/logoBlase.png';
import {
  billDateTostringDate,
  checkActive,
  convertImageToBase64,
  convertirFechaISOaDDMMYYYYHHMM,
  getBillType,
  numberToString,
  presDateIsoTostringDate,
  selectStylesByDate,
} from '../../../utils';
import logoAfip from '../../../assets/afip/logo-vector-afip.jpg';
import { Checkbox, Pagination, Select } from 'semantic-ui-react';
import styles from './clientAcountTables.module.css';
import {
  getBillDataRequest,
  printNCByNumRequest,
  printNCPresByNumRequest,
  rePrintPresRequest,
} from '../../../request/orderRequest';
import QRCode from 'qrcode';
import { billHtml } from '../../../templates/bill';
import {
  resetFilterMovements,
  setFilterMovements,
} from '../../../redux/filtersMovements';
import {
  getMovementsByCurrentAcountIdX,
  marcMovementsByCurrentAcountId,
  resetMovementsByCurrentAcountId,
} from '../../../redux/searchCurrentAcount';
import { MovTypeEnum } from '../../../enum/MovEnum';
import CustomModal from '../../../commonds/customModal/CustomModal';
import BillViewModalContainer from '../../../containers/BillViewModalContainer';
import { getBillByIdRequest } from '../../../request/billRequest';
import { ncAHtml } from '../../../templates/ncA';
import { ncPresupHtml } from '../../../templates/ncPresupBlase';
import { presupHtml } from '../../../templates/presupBlase';
import { remitHtml } from '../../../templates/RemBlase';
import { payDetail } from '../../../templates/payDetail';
import { billRHtml } from '../../../templates/billRProvis';

const CustomComp = ({ data }) => {
  // console.log(data);
  const { list } = useSelector((state) => state.searchMovements).data
    ?.movements;
  // console.log(list[0])
  // return <></>
  const selectMov = list?.find((m) => m.id == data.id);
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(marcMovementsByCurrentAcountId(data.id));
  };
  return (
    <div className={styles.buttonContainer}>
      <Checkbox
        disabled={checkActive(data)}
        onChange={onClick}
        checked={selectMov?.marc}
      />
    </div>
  );
};

const CustomActionComp = ({ data }) => {
  // console.log(data)
  const [printLoading, setPrintLoading] = useState(false);
  const { client } = useSelector((state) => state.searchMovements)?.data
    ?.currentAcount;
  // console.log(client);
  const rePrint = async (bill) => {
    // console.log(bill);
    let billRemDate = { type: null, date: null };
    setPrintLoading(true);
    let purchaseOrder;
    let numRemito;
    const logoAfipBase64 = await convertImageToBase64(logoAfip);
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    const { billType, numComprobante, id } = bill;

    let nuevaVentana;
    //FACTURA A
    if (billType == 1 || billType == 6) {
      const billData = await getBillDataRequest(numComprobante, billType, data.ptoVta);
      numRemito = billData.billData.ResultGet.CbteDesde;
      billRemDate.type = 'f';
      billRemDate.date = billDateTostringDate(
        billData.billData.ResultGet.CbteFch
      );
      const billInfo = await getBillByIdRequest(id);
      const { fItems } = billInfo;
      purchaseOrder = billInfo.purchaseOrder;
      const codigoQR = await QRCode.toDataURL(billData.url);

      const factItems = fItems;
      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(factItems.length / itemsPerPage);
      nuevaVentana = window.open('', '', 'width=900,height=1250');

      // Primero imprimimos las facturas
      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = await billHtml(
          billData.billData.ResultGet,
          purchaseOrder,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          logoAfipBase64,
          logoBlaseBase64
        );
        const containerFact = nuevaVentana.document.createElement('div');
        containerFact.innerHTML = render;

        // Agregar el contenido generado a la ventana
        nuevaVentana.document.body.appendChild(containerFact);

        // Si no es la última página, agregar un salto de página
        if (pageNumber < totalPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }

      // ahora imprimimos los REMITOS R
      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = await billRHtml(
          billData.billData.ResultGet,
          purchaseOrder,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          logoAfipBase64,
          logoBlaseBase64
        );
        const containerFact = nuevaVentana.document.createElement('div');
        containerFact.innerHTML = render;

        // Agregar el contenido generado a la ventana
        nuevaVentana.document.body.appendChild(containerFact);

        // Si no es la última página, agregar un salto de página
        if (pageNumber < totalPages) {
          const pageBreak = nuevaVentana.document.createElement('div');
          pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
          nuevaVentana.document.body.appendChild(pageBreak);
        }
      }
    }
    //PRESUPUESTO
    if (billType == 0) {
      const presData = await rePrintPresRequest(bill.id);
      purchaseOrder = presData.purchaseOrder;
      // console.log(presData);

      numRemito = purchaseOrder.pickingOrder.numRemito;

      const factPresItems = purchaseOrder.purchaseOrderItems.filter(
        (poi) => !poi.fact
      );
      billRemDate.type = 'p';
      billRemDate.date = presDateIsoTostringDate(presData.fecha);

      const itemsPerPage = 12; // Número de ítems por página
      const totalPresPages = Math.ceil(factPresItems.length / itemsPerPage);

      nuevaVentana = window.open('', '', 'width=900,height=1250');

      for (let i = 0; i < factPresItems.length; i += itemsPerPage) {
        const pagePresNumber = Math.floor(i / itemsPerPage) + 1;
        const pagePresItems = factPresItems.slice(i, i + itemsPerPage);

        const render = presupHtml(
          presData,
          purchaseOrder,
          logoBlaseBase64,
          pagePresItems,
          pagePresNumber,
          totalPresPages
        );
        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
      // nuevaVentana.document.body.appendChild(
      //   nuevaVentana.document.createElement("div")
      // ).style.pageBreakBefore = "always";
    }

    // Después imprimimos los remitos
    const itemsRemPage = 14;
    const totalRemPages = Math.ceil(
      purchaseOrder.purchaseOrderItems.length / itemsRemPage
    );

    for (
      let i = 0;
      i < purchaseOrder.purchaseOrderItems.length;
      i += itemsRemPage
    ) {
      const pageNumber = Math.floor(i / itemsRemPage) + 1;
      const pageItems = purchaseOrder.purchaseOrderItems.slice(
        i,
        i + itemsRemPage
      );

      const containerRem = nuevaVentana.document.createElement('div');
      containerRem.innerHTML = remitHtml(
        purchaseOrder,
        numRemito,
        pageItems,
        pageNumber,
        totalRemPages,
        logoBlaseBase64,
        billRemDate
      );

      nuevaVentana.document.body.appendChild(containerRem);

      // Si no es la última página, agregar un salto de página
      if (pageNumber < totalRemPages) {
        const pageBreak = nuevaVentana.document.createElement('div');
        pageBreak.style.pageBreakAfter = 'always'; // Salto de página después del contenido
        nuevaVentana.document.body.appendChild(pageBreak);
      }
    }
    setPrintLoading(false);
  };
  const ncRePrint = async (nc) => {
    setPrintLoading(true);
    const { currentAcountId, numComprobante, billType } = nc;
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    if (billType == 1 || billType == 8 || billType == 3) {
      const ncData = await printNCByNumRequest(numComprobante, currentAcountId, data.ptoVta);
      const ncDetail = await getBillByIdRequest(nc.id);
      const items = ncDetail.ncOrderItems;
      const client = ncDetail.currentAcount.client;

      const codigoQR = await QRCode.toDataURL(ncData.url);

      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(items.length / itemsPerPage);
      let nuevaVentana = window.open('', '', 'width=900,height=1250');

      for (
        let i = 0;
        i < (items.length == 0 ? 1 : items.length);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems =
          items?.length > 0 ? items.slice(i, i + itemsPerPage) : [];

        const render = ncAHtml(
          ncData.billData.ResultGet,
          client,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          nc.concept
        );

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    if (billType == 2) {
      const presData = await printNCPresByNumRequest(numComprobante);
      const client = presData.currentAcount?.client;

      const items = presData.ncOrderItems;
      const itemsPerPage = 10; // Número de ítems por página
      const totalPages =
        Math.ceil(items?.length / itemsPerPage) > 0
          ? Math.ceil(items?.length / itemsPerPage)
          : 1;

      for (
        let i = 0;
        i < (items.length > 0 ? items.length : 1);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = items?.slice(i, i + itemsPerPage);

        const render = ncPresupHtml(
          presData,
          client,
          pageItems,
          pageNumber,
          totalPages,
          logoBlaseBase64,
          presData.concept
        );

        const nuevaVentana = window.open('', '', 'width=900,height=1250');
        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    setPrintLoading(false);
  };

  const printPayDetail = async (client, payData) => {
    const nuevaVentana = window.open('', '', 'width=900,height=625');
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);

    const containerRem = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(containerRem);
    // console.log(payData);
    containerRem.innerHTML = payDetail(client, payData, logoBlaseBase64);
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  const payReprint = async (movement) => {
    printPayDetail(client, movement.payDetail);
  };
  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        title={`Comprobante N° ${data.numComprobante}`}
        size="xl"
        actionButton={
          <button
            style={{ margin: '1px 0px 0px 7px' }}
            className={styles.iconButton}
            type="button"
          >
            <i className={`fa-solid fa-circle-info ${styles.blueIcon}`}></i>
          </button>
        }
        bodyModal={(props) => <BillViewModalContainer {...props} />}
        bodyProps={{ movId: data.id }}
      />
      <button
        style={{ margin: '1px 0px 0px 7px' }}
        className={styles.iconButton}
        type="button"
        onClick={() => {
          // console.log(data);
          if (data.billType == 2 || data.billType == 3 || data.billType == 8) {
            ncRePrint(data);
          }
          if (
            (data.billType == 0 && data.type != 2) ||
            data.billType == 1 ||
            data.billType == 6
          ) {
            rePrint(data);
          }
          if (data.type == 2) {
            payReprint(data);
          }
        }}
      >
        {false ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <i className={`fa-solid fa-print ${styles.greenIcon}`}></i>
        )}
      </button>
    </div>
  );
};

function ClientAcountTable(props) {
  // console.log(props);
  const [printLoading, setPrintLoading] = useState(false);
  const dispatch = useDispatch();

  let columnInitialState = [
    {
      headerName: 'Check',
      cellRenderer: (params) => <CustomComp data={params.data} />,
      flex: 0.5,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Fecha',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {convertirFechaISOaDDMMYYYYHHMM(params.data.fecha)}
        </span>
      ),
      flex: 1,
      filterParams: {
        filterOptions: ['contains'], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: 'Concepto',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {getBillType(MovTypeEnum[params.data.type], params.data.billType)}
        </span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Factura/N-Crédito',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {getBillType(MovTypeEnum[params.data.type], params.data.billType) !=
            'Pago' &&
          getBillType(MovTypeEnum[params.data.type], params.data.billType) !=
            'Descuento'
            ? params.data.numComprobante
            : '-'}
        </span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Factura Asoc.',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
            'Pago' ||
          getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
            'Nota de crédito' ||
          getBillType(MovTypeEnum[params.data.type], params.data.billType) ==
            'Devolución'
            ? params.data.bills.map((b, i) => {
                if (i > 0) {
                  return `-${b.numComprobante}`;
                }
                return b.numComprobante;
              })
            : '-'}
        </span>
      ),
      filter: false,
      flex: 1,
      sortable: false,
    },
    {
      headerName: 'Cbte del Sist.',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {params.data.payDetail?.id}
        </span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Cbte del Vdor.',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {params.data.payDetail?.comprobanteVendedor}
        </span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Monto',
      cellRenderer: (params) => (
        <span
          className={params.data.esOferta ? styles.greenRow : ''}
        >{`$${numberToString(params.data.total)}`}</span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Pendiente',
      cellRenderer: (params) => (
        <span className={params.data.esOferta ? styles.greenRow : ''}>
          {params?.data?.saldoPend
            ? `$${numberToString(params?.data?.saldoPend)}`
            : '-'}
        </span>
      ),
      filter: false,
      flex: 1,
    },
    {
      headerName: 'Acciones',
      cellRenderer: (params) => <CustomActionComp data={params.data} />,
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

  const currentAcountState = useSelector((state) => state.searchMovements);

  const data = useMemo(() => {
    return currentAcountState.data;
  }, [currentAcountState.data?.currentAcount]);

  // console.log(data.movements);

  const filterMovements = useSelector((state) => state.filterMovementsOrder);
  // console.log(filterMovements);

  const selectChange = (e, d) => {
    dispatch(setFilterMovements({ name: 'pageSize', value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterMovements({ name: 'page', value: d.activePage }));
  };

  useEffect(() => {
    dispatch(getMovementsByCurrentAcountIdX(filterMovements))
      .then(() => {})
      .catch((err) => console.log(err));

    return () => {
      dispatch(resetMovementsByCurrentAcountId(null));
    };
  }, [filterMovements]);

  useEffect(() => {
    return () => {
      dispatch(resetFilterMovements());
    };
  }, []);

  return (
    <div
      className={'ag-theme-quartz'}
      style={{ height: 480, marginTop: '5px' }}
    >
      <AgGridReact
        rowData={data?.movements?.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowClass={(params) => params.data.pending ? styles[selectStylesByDate(params?.data?.fecha)] : ""}
      />
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${data?.movements?.totalPages} páginas con ${data?.movements?.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: '10px' }}>
            <Select
              width="10px"
              defaultValue={filterMovements.pageSize}
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
            activePage={filterMovements.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={data?.movements?.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default ClientAcountTable;
