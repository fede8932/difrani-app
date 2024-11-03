import React, { useEffect } from "react";
import FormSelectClientSellOrder from "../components/formSelectSellOrder/FormSelectClientSellOrder";
import { useDispatch, useSelector } from "react-redux";
import { getClientByTextRequest } from "../redux/searchClient";
import Swal from "sweetalert2";
import { updateClientStatusOrder } from "../request/orderRequest";
import { useNavigate } from "react-router";
import { newSellOrderRequest } from "../redux/newOrder";

function FormSelectClientContainer(props) {
  const { type, nextFn } = props;
  const navigate = useNavigate();
  const client = useSelector((state) => state.client);
  const order = useSelector((state) => state.newBuyOrder);
  const dispatch = useDispatch();
  const searchClient = (text) => {
    dispatch(getClientByTextRequest(text.campo));
  };
  // console.log(client);
  const confirm = () => {
    if (type != "sale") {
      Swal.fire({
        title: "Estás seguro?",
        text: "Vas a confirmar una venta y ya no podrás modificarla.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, confirmar",
      }).then((result) => {
        if (result.isConfirmed) {
          updateClientStatusOrder({
            id: order.data.id,
            status: "Confirm",
            clientId: client.data.id,
          }).then(() => {
            Swal.fire(
              "Orden de venta",
              "Se ha registrado la venta",
              "success"
            ).then(() => {
              navigate("/");
            });
          });
        }
      });
    } else {
      dispatch(newSellOrderRequest(client.data.id)).then(() => {
        nextFn(1);
      });
    }
  };

  return (
    <FormSelectClientSellOrder
      {...props}
      searchClient={searchClient}
      client={client.data}
      confirmFn={confirm}
    />
  );
}

export default FormSelectClientContainer;
