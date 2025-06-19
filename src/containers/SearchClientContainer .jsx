import React, { useEffect, useRef, useState } from "react";
import SearchClientComponent from "../components/searchClient/SearchClientComponent";
import { useDispatch, useSelector } from "react-redux";
import { getClientssByTextRequest } from "../redux/searchClient";
import { useLocation, useNavigate } from "react-router";
import { getClientIdRequest, resetClientState } from "../redux/client";

function SearchClientContainer(props) {
  const location = useLocation();
  const [sellerId, setSellerId] = useState(
    location.pathname.split("/").filter(Boolean).pop()
  );
  const [color, setColor] = useState("todos");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // console.log(sellerId);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const result = useSelector((state) => state.searchClients);

  const changePage = (page) => {
    setPage(page);
  };

  const redirectEditPercents = (clientId) => {
    dispatch(getClientIdRequest(clientId)).then(() => {
      navigate(`/edit/client/${clientId}`);
    });
  };

  const handleReset = () => {
    setInputValue("");
    setColor("todos");
    setPage(1);
    setPageSize(10);
  };

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (inputValue.trim() !== null) {
        // console.log('Buscando:', inputValue); // Aquí va tu lógica de búsqueda
        const data = {
          text: inputValue,
          color: color,
          page: page,
          pageSize: pageSize,
          orderByColumn: "id",
          sellerId: isNaN(Number(sellerId)) ? null : sellerId,
        };
        dispatch(getClientssByTextRequest(data));
      }
    }, 800); // Espera 800 ms después de dejar de tipear
  }, [inputValue, color, page, pageSize]);

  useEffect(() => {
    return () => {
      dispatch(resetClientState());
    };
  }, [sellerId]);

  return (
    <SearchClientComponent
      sellerId={isNaN(Number(sellerId)) ? null : sellerId}
      result={result}
      redirectEditPercents={redirectEditPercents}
      changePageFn={changePage}
      color={color}
      setColor={setColor}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleReset={handleReset}
      pageSize={pageSize}
      setPageSize={setPageSize}
    />
  );
}

export default SearchClientContainer;
