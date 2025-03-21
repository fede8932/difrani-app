import React from 'react';
import NewBill from '../components/newBill/NewBill';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertImageToBase64,
  cuitTransformToNumber,
  redondearADosDecimales,
  waitForImagesToLoad,
} from '../utils';
import {
  confirmSellOrderRequest,
  searchSellOrderRequest,
} from '../redux/searchOrders';
import { useNavigate } from 'react-router';
import { factItemToggleRequest } from '../redux/addOrderItems';
import Swal from 'sweetalert2';
import { printBillRequest, printPresRequest } from '../request/orderRequest';
import { billHtml } from '../templates/bill.js';
import QRCode from 'qrcode';
import { presupHtml } from '../templates/presupBlase.js';
import { remitHtml } from '../templates/RemBlase.js';
import logoAfip from '../assets/afip/logo-vector-afip.jpg';
import logoBlase from '../assets/logo/logoBlase.png';

function NewBillContainer(props) {
  const { closeModal/*, listOrder*/ } = props;
  const client = useSelector((state) => state.client.data);
  const order = useSelector((state) => state.newBuyOrder.data);
  const searchOrderLoading = useSelector((state) => state.searchOrders.loading);
  const filterSellOrder = useSelector((state) => state.filterSellOrder);

  const listOrder = useSelector((state) => state.listOrderItems).data;

  // console.log(order);

  const totalFacturado = listOrder.reduce((accumulator, object) => {
    if (object.fact) {
      return accumulator + object.sellPrice * object.amount * 1.21;
    } else {
      return accumulator;
    }
  }, 0);
  const totalNoFacturado = listOrder.reduce((accumulator, object) => {
    // console.log(object);
    if (!object.fact) {
      return accumulator + object.sellPrice * object.amount;
    } else {
      return accumulator;
    }
  }, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addItemToBill = (itemId) => {
    dispatch(factItemToggleRequest(itemId));
  };
  const printBill = async (order, totalFacturado, totalNoFacturado) => {
    // console.log(order);
    // console.log("fact:", totalFacturado, "noFac:", totalNoFacturado);
    let numRemito;
    const logoAfipBase64 = await convertImageToBase64(logoAfip);
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);
    // console.log(logoBlaseBase64);
    const nuevaVentana = window.open('', '', 'width=900,height=1250');
    // Obtener datos de la factura
    if (totalFacturado > 0) {
      const billData = await printBillRequest(order.id);
      const codigoQR = await QRCode.toDataURL(billData.url);
      numRemito = billData.billData.ResultGet.CbteDesde;

      const factItems = order.purchaseOrderItems.filter((poi) => poi.fact);

      const itemsPerPage = 10; // Número de ítems por página
      const totalPages = Math.ceil(factItems.length / itemsPerPage);

      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = await billHtml(
          billData.billData.ResultGet,
          order,
          codigoQR,
          pageItems,
          pageNumber,
          totalPages,
          logoAfipBase64,
          logoBlaseBase64
        );

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    if (totalNoFacturado > 0) {
      numRemito = totalFacturado > 0 ? numRemito : order.id;

      const presData = await printPresRequest(order.id);

      const factItems = order.purchaseOrderItems.filter((poi) => !poi.fact);

      const itemsPerPage = 16; // Número de ítems por página
      const totalPages = Math.ceil(factItems.length / itemsPerPage);

      for (let i = 0; i < factItems.length; i += itemsPerPage) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems = factItems.slice(i, i + itemsPerPage);

        const render = presupHtml(
          presData,
          order,
          logoBlaseBase64,
          pageItems,
          pageNumber,
          totalPages
        );

        const containerPres = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerPres);

        containerPres.innerHTML = render;
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
      if (totalPages > 1) {
        nuevaVentana.document.body.appendChild(
          nuevaVentana.document.createElement('div')
        ).style.pageBreakBefore = 'always';
      }
    }
    const itemsPerPage = 14;
    const totalPages = Math.ceil(
      order.purchaseOrderItems.length / itemsPerPage
    );
    for (let i = 0; i < order.purchaseOrderItems.length; i += itemsPerPage) {
      const pageNumber = Math.floor(i / itemsPerPage) + 1;
      const pageItems = order.purchaseOrderItems.slice(i, i + itemsPerPage);
      const containerRem = nuevaVentana.document.createElement('div');
      nuevaVentana.document.body.appendChild(containerRem);
      containerRem.innerHTML = remitHtml(
        order,
        numRemito,
        pageItems,
        pageNumber,
        totalPages,
        logoBlaseBase64
      );
      nuevaVentana.document.body.appendChild(
        nuevaVentana.document.createElement('div')
      ).style.pageBreakBefore = 'always';
    }
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };
  const newBill = () => {
    const facturaType = client.iva == 'Monotributista' ? 'A' : 'A';
    let sendData = {
      concepto: 'Productos',
      type: 'Factura',
      tipo_de_factura: facturaType,
      tipo_de_documento: 'CUIT',
      numero_de_documento: cuitTransformToNumber(client.cuit),
      importe_gravado: redondearADosDecimales(totalFacturado / 1.21),
      importe_excento: 0,
      // ivaCalculado: redondearADosDecimales((totalFacturado / 1.21) * 0.21),
      purchaseOrderId: order.id,
      salePoint: 13,
      iva: 21,
      importe_no_facturado: totalNoFacturado,
    };
    dispatch(confirmSellOrderRequest(sendData)).then((res) => {
      closeModal();
      if (res.error) {
        Swal.fire({
          icon: 'warning',
          title: 'No emitimos la factura',
          text: 'Generamos los registros de pendientes y eliminamos la orden de monto cero.',
        });
        navigate('/search/sell')
      } else {
        printBill(res.payload, totalFacturado, totalNoFacturado);
        dispatch(searchSellOrderRequest(filterSellOrder)).then((res) => {
          navigate('/search/sell');
        });
      }
    });
  };

  return (
    <NewBill
      client={client}
      order={order}
      onSubmit={newBill}
      addItemToBill={addItemToBill}
      listOrder={listOrder}
      totalFac={totalFacturado}
      totalNoFac={totalNoFacturado}
      loading={searchOrderLoading}
    />
  );
}

export default NewBillContainer;
