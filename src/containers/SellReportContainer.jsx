import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReportRequest } from "../redux/report";
import SellReportComponent from "../components/sellReport/SellReportComponent";
import Swal from "sweetalert2";
import { genOrderReportRequest } from "../redux/dateReport";
import { getBrandRequest, resetBrandRequest } from "../redux/brand";
import { getClientRequest, resetAllClientRequest } from "../redux/client";

function SellReportContainer(props) {
  const report = useSelector((state) => state.report);
  const clients = useSelector((state) => state.client);
  const brands = useSelector((state) => state.brand);
  // console.log(clients);
  const dispatch = useDispatch();
  const filterReport = (data) => {
    let sendData = { rows: 10, page: data.page };
    if (data.init && data.end) {
      sendData.init = new Date(data.init);
      sendData.end = new Date(data.end);
    }
    sendData.brandId = data.brandId != "" ? Number(data.brandId) : null;
    sendData.clientId = data.clientId != "" ? Number(data.clientId) : null;
    // console.log(sendData);
    dispatch(getReportRequest(sendData));
  };
  const genOrder = () => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Vas a generar ordenes de compra en base a los reportes de venta",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, generar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(genOrderReportRequest()).then((res) => {
          if (res.error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrió un error en el servidor",
            });
          } else {
            Swal.fire({
              title: "Generado",
              text: "Podrás acceder a las compras desde 'Buscar ordenes de compra'",
              icon: "success",
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    dispatch(getReportRequest({ rows: 10, page: 1 }));
    dispatch(getBrandRequest());
    dispatch(getClientRequest(true));
    return () => {
      dispatch(resetAllClientRequest());
      dispatch(resetBrandRequest());
    };
  }, []);
  return (
    <SellReportComponent
      {...props}
      brands={brands.data}
      clients={clients.data}
      filterFn={filterReport}
      reportState={report}
      genOrder={genOrder}
    />
  );
}

export default SellReportContainer;
