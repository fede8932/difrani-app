import React from "react";
import OrderViewComponent from "../components/orderView/OrderViewComponent";
import { useDispatch, useSelector } from "react-redux";
import { getBuyOrderRequest } from "../redux/newOrder";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { updateClientStatusOrder } from "../request/orderRequest";

function OrderViewContainer(props) {
  // console.log(props);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector((state) => state.client);

  const buyOrderSelected = useSelector((state) => state.buyOrder);

  const addFact = (orderId) =>
    dispatch(getBuyOrderRequest(orderId)).then(() => {
      navigate("/search/buy/addfac");
    });
  const updateOrder = (orderId, status) => {
    // console.log(orderId, status);
    Swal.fire({
      title: "Estás seguro?",
      text: "Vas a confirmar una venta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        updateClientStatusOrder({
          id: orderId,
          status: status,
        }).then((res) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Orden de venta confirmada, generamos la orden de pedido",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            navigate("/picking/orden");
          });
        });
      }
    });
  };
  return (
    <OrderViewComponent
      {...props}
      addFact={addFact}
      confirmFn={updateOrder}
      order={buyOrderSelected.data}
    />
  );
}

export default OrderViewContainer;
