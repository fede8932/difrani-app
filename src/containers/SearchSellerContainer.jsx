import React, { useEffect } from "react";
import SearchSellerComponent from "../components/searchSeller/SearchSellerComponent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getSellersByTextRequest } from "../redux/searchSeller";
import { getPendingBySellerReq } from "../request/movNoApplyRequest";
import { clienteReportBySeller } from "../templates/clienteReportBySeller";

function SearchSellerContainer(props) {
  const methods = useForm();
  const dispatch = useDispatch();
  const searchSeller = (data) => {
    const carcterInicial = parseInt(data.text.substring(0, 1), 10);
    if (isNaN(carcterInicial)) {
      data.by = "name";
    } else {
      data.by = "cuil";
    }
    data.page = 1;
    data.pageSize = 10;
    data.orderByColumn = "id";
    dispatch(getSellersByTextRequest(data));
  };
  const result = useSelector((state) => state.searchSellers);
  useEffect(() => {
    const data = {
      text: "null",
      by: "cuil",
      page: 1,
      pageSize: 10,
      orderByColumn: "id",
    };
    dispatch(getSellersByTextRequest(data));
  }, []);
  const resetSearch = () => {
    const data = {
      text: "null",
      by: "cuil",
      page: 1,
      pageSize: 10,
      orderByColumn: "id",
    };
    dispatch(getSellersByTextRequest(data));
  };

  const clientsResumePrint = async (sellerId) => {
    try {
      const { cuil, user, clients } = await getPendingBySellerReq(sellerId);
      // console.log(cuil, user, clients);

      const render = await clienteReportBySeller(
        cuil,
        user.name,
        user.lastName,
        clients
      );

      const nuevaVentana = window.open("", "", "width=900,height=1250");
      const containerFact = nuevaVentana.document.createElement("div");
      nuevaVentana.document.body.appendChild(containerFact);

      containerFact.innerHTML = render;
    } catch (err) {
      throw err;
    } finally {
    }
  };

  return (
    <SearchSellerComponent
      methods={methods}
      onSubmit={searchSeller}
      result={result}
      resetSearch={resetSearch}
      clientsResumePrint={clientsResumePrint}
    />
  );
}

export default SearchSellerContainer;
