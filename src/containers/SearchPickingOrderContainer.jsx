import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import PickingOrderList from "../commonds/pickingOrderPDF/PickingOrderList";
import SearchPickingOrderComponent from '../components/searchPickingOrder/SearchPickingOrderComponent';
import {
  getPickingOrderRequest,
  printPickingOrderRequest,
  updatePickingOrderRequest,
} from '../redux/clientPickingOrder';
import { selectPickingOrder } from '../request/clientRequest';
import Swal from 'sweetalert2';
import { nPedHtml } from '../templates/blaseOped';

function SearchPickingOrderContainer(props) {
  const pickings = useSelector((state) => state.pickingOrders);
  const [ventanaAbierta, setVentanaAbierta] = useState(null);
  const dispatch = useDispatch();

  const abrirNuevaVentana = async (pickingOrderId) => {
    const pickingOrder = await selectPickingOrder(pickingOrderId);
    const itemsPorPagina = 19;
    const totalItems = pickingOrder.purchaseOrder?.purchaseOrderItems.length;
    const totalPages = Math.ceil(totalItems / itemsPorPagina);

    const nuevaVentana = window.open('', '', 'width=794,height=1123');

    for (let i = 0; i < totalPages; i++) {
      const inicio = i * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      const itemsPagina = pickingOrder.purchaseOrder?.purchaseOrderItems.slice(
        inicio,
        fin
      );

      const htmlContent = nPedHtml(
        pickingOrder,
        i + 1,
        totalPages,
        itemsPagina
      );

      // Escribe el contenido HTML en la ventana
      nuevaVentana.document.write(htmlContent);
    }

    nuevaVentana.document.close(); // Cierra el flujo de escritura de la ventana.

    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close(); // Cierra la ventana después de imprimir
    });

    nuevaVentana.print();
    dispatch(printPickingOrderRequest(pickingOrderId));
  };

  const updatePicking = async (id) => {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'El pedido está listo para facturarse',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, está listo',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updatePickingOrderRequest({ id: id }))
          .then((res) => {
            if (res.error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: res.error.message,
              });
            } else {
              Swal.fire('Actualizado', '', 'success');
            }
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.message,
            });
          });
      }
    });
  };

  return (
    <SearchPickingOrderComponent
      printFn={abrirNuevaVentana}
      updatePicking={updatePicking}
    />
  );
}

export default SearchPickingOrderContainer;
