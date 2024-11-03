import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchControlOrderComponent from "../components/searchControlOrder/SearchControlOrderComponent";
import { getControlOrderRequest } from "../redux/supplierControlOrder";
// import ControlList from "../commonds/controlOrderPDF/ControlList";
import { selectControlOrder } from "../request/supplierRequest";
import PdfGen from "../commonds/PDFGen/PdfGen";

function SearchControlOrderContainer(props) {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.controlOrders);
  const [ventanaAbierta, setVentanaAbierta] = useState(null);

  const changePag = (page) => {
    dispatch(getControlOrderRequest({ order: "DES", rows: 10, page: page }));
  };

  const abrirNuevaVentana = async (controlOrderId) => {
    const constrolOrder = await selectControlOrder(controlOrderId);
    const nuevaVentana = window.open("", "", "width=1500,height=900");
    const container = nuevaVentana.document.createElement("div");
    nuevaVentana.document.body.appendChild(container);
    setVentanaAbierta(container);
    ReactDOM.render(<PdfGen controlOrder={constrolOrder} />, container);
    nuevaVentana.addEventListener("afterprint", () => {
      nuevaVentana.close(); // Cierra la ventana después de imprimir
    });
    nuevaVentana.print();
  };
  useEffect(() => {
    dispatch(getControlOrderRequest({ order: "DES", rows: 10, page: 1 }));
  }, []);

  return (
    <SearchControlOrderComponent
      result={result}
      printFn={abrirNuevaVentana}
      changePag={changePag}
    />
  );
}

export default SearchControlOrderContainer;
