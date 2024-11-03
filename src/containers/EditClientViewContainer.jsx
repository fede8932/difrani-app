import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import EditClientViewComponent from "../components/editClientView/EditClientViewComponent";
import { getSellersRequest } from "../redux/seller";
import { UpdateClientsRequest } from "../redux/searchClient";
import { getClientIdRequest, resetAllClientRequest } from "../redux/client";

function EditClientViewContainer(props) {
  const { client, close, clientId } = props;
  // console.log(client);
  const { loading } = useSelector((state) => state.searchClients);

  const sendClient = clientId
    ? useSelector((state) => state.client).data
    : client;

  const sellers = useSelector((state) => state.seller);
  const methods = useForm();
  const dispatch = useDispatch();
  const updateClient = (data) => {
    const { iva, sellerId, ...clientData } = data;
    clientData.iva = iva != "" ? iva : sendClient.iva;
    clientData.sellerId =
      sellerId != "" ? Number(sellerId) : sendClient.sellerId;
    clientData.altura = Number(clientData.altura);
    clientData.codigoPostal = Number(clientData.codigoPostal);
    clientData.id = clientId ? clientId : client.id;
    dispatch(UpdateClientsRequest(clientData)).then((res) => {
      // console.log(clientData);
      // console.log(res);
      close();
    });
  };
  useEffect(() => {
    dispatch(getSellersRequest());
    if (clientId) {
      dispatch(getClientIdRequest(clientId));
    }
    return () => dispatch(resetAllClientRequest());
  }, []);
  return (
    <EditClientViewComponent
      {...props}
      client={sendClient}
      sellers={sellers.data}
      update={updateClient}
      methods={methods}
      loading={loading}
    />
  );
}

export default EditClientViewContainer;
