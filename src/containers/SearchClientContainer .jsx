import React, { useEffect, useState } from "react";
import SearchClientComponent from "../components/searchClient/SearchClientComponent";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getClientssByTextRequest } from "../redux/searchClient";
import { useLocation, useNavigate } from "react-router";
import { getClientIdRequest, resetAllClientRequest } from "../redux/client";

function SearchClientContainer(props) {
  const location = useLocation();
  const [sellerId, setSellerId] = useState(
    location.pathname.split("/").filter(Boolean).pop()
  );
  // console.log(sellerId);

  const methods = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState({
    text: "null",
    page: 1,
    pageSize: 10,
    orderByColumn: "id",
  });
  const searchClient = (data) => {
    data.page = 1;
    data.pageSize = 10;
    data.orderByColumn = "id";
    data.text = data.campo;
    (data.sellerId = isNaN(Number(sellerId)) ? null : sellerId),
      setSearchData(data);
    dispatch(getClientssByTextRequest(data));
  };
  const result = useSelector((state) => state.searchClients);
  useEffect(() => {
    const data = {
      text: "null",
      page: 1,
      pageSize: 10,
      orderByColumn: "id",
      sellerId: isNaN(Number(sellerId)) ? null : sellerId,
    };
    dispatch(getClientssByTextRequest(data));
    return () => {
      dispatch(resetAllClientRequest());
    };
  }, [sellerId]);

  const changePage = (page) => {
    let data = { ...searchData };
    data.page = page;
    setSearchData(data);
    dispatch(getClientssByTextRequest(data));
  };

  const redirectEditPercents = (clientId) => {
    dispatch(getClientIdRequest(clientId)).then(() => {
      navigate(`/edit/client/${clientId}`);
    });
  };

  const resetSearch = () => {
    navigate("/search/client");
    setSellerId(null);
    const data = {
      text: "null",
      page: 1,
      pageSize: 10,
      orderByColumn: "id",
      seller: sellerId,
    };
    dispatch(getClientssByTextRequest(data));
  };

  return (
    <SearchClientComponent
      methods={methods}
      onSubmit={searchClient}
      result={result}
      redirectEditPercents={redirectEditPercents}
      resetSearch={resetSearch}
      changePageFn={changePage}
    />
  );
}

export default SearchClientContainer;
