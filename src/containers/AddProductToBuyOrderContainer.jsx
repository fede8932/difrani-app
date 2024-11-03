import React, { useEffect, useState } from "react";
import AddProductToOrder from "../components/addProductToOrder/AddProductToOrder";
import { useForm } from "react-hook-form";
import { searchProductRequest } from "../redux/product";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderItemsRequest,
  deleteOrderItemsRequest,
  getOrderItemsRequest,
  updateCantItemsRequest,
  updatePriceItemsRequest,
} from "../redux/addOrderItems";
import { getBuyOrderRequest } from "../redux/newOrder";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { updateStatusOrder } from "../request/orderRequest";
import { useLocation } from "react-router-dom";
import {
  addAjustItemsRequest,
  deleteAjustItemsRequest,
  updateCantAjustItemsRequest,
  updatePriceAjustItemsRequest,
} from "../redux/addAjustItems";
import { getOrderAjust } from "../redux/orderAjust";
import { updateStatusAjust } from "../request/orderAjustRequest";

function AddProductToBuyOrderContainer(props) {
  const [showAlert, setShowAlert] = useState(false);
  const { type } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const actualOrder = useSelector((state) => state.newBuyOrder);
  const orderAjust = useSelector((state) => state.orderAjust);
  const listOrderItems = useSelector((state) => state.listOrderItems);
  const methods = useForm();
  const dispatch = useDispatch();
  const productPages = useSelector((state) => state.product);
  const searchProd = (data) => {
    data.supplierId = actualOrder.data.supplierId;
    dispatch(searchProductRequest(data));
  };
  const addProductToOrder = (brandProduct) => {
    const { product, brand } = brandProduct;
    const objSend = {
      productId: product.id,
      brandId: brand.id,
      orderId: actualOrder.data.id,
      cantidad: 1,
    };
    if (type !== "ajuste") {
      dispatch(addOrderItemsRequest(objSend)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id)).then(() => {
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 700);
        });
      });
    } else {
      (objSend.orderId = orderAjust.data.id),
        dispatch(addAjustItemsRequest(objSend)).then(() => {
          dispatch(getOrderAjust(actualOrder.data.id));
        });
    }
  };
  const infoProduct = (product) => {
    // console.log("anda", product, productPages, actualOrder);
  };
  const deleteOrder = (dataOrder) => {
    if (type !== "ajuste") {
      dispatch(deleteOrderItemsRequest(dataOrder)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id));
      });
    } else {
      dispatch(deleteAjustItemsRequest(dataOrder)).then(() => {
        dispatch(getOrderAjust(actualOrder.data.id));
      });
    }
  };
  const updateCantOrderItem = async (dataOrderItem) => {
    if (type !== "ajuste") {
      dispatch(updateCantItemsRequest(dataOrderItem)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id));
      });
    } else {
      dispatch(updateCantAjustItemsRequest(dataOrderItem)).then(() => {
        dispatch(getOrderAjust(actualOrder.data.id));
      });
    }
  };
  const updatePrecOrderItem = async (dataOrderItem) => {
    if (type !== "ajuste") {
      dispatch(updatePriceItemsRequest(dataOrderItem)).then(() => {
        dispatch(getBuyOrderRequest(actualOrder.data.id));
      });
    } else {
      console.log(dataOrderItem);
      dispatch(updatePriceAjustItemsRequest(dataOrderItem)).then(() => {
        dispatch(getOrderAjust(actualOrder.data.id));
      });
    }
  };
  const confirmOrder = () => {
    const question = type !== "ajuste" ? "orden" : "ajuste";
    Swal.fire({
      title: `Confirmar ${question}?`,
      text: "Ya no se podrá modificar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (type !== "ajuste") {
          updateStatusOrder({
            id: actualOrder.data.id,
            status: "Confirm",
          }).then(() => {
            Swal.fire(
              "Orden confirmada",
              "Tu orden se ha confirmado correctamente",
              "success"
            ).then(() => {
              navigate("/search/buy");
            });
          });
        } else {
          updateStatusAjust({ id: orderAjust.data.id, status: "Confirm" }).then(
            () => {
              Swal.fire(
                "Orden confirmada",
                "Tu orden se ha confirmado correctamente",
                "success"
              ).then(() => {
                navigate("/search/buy");
              });
            }
          );
        }
      }
    });
  };
  useEffect(() => {
    dispatch(
      searchProductRequest({
        dataSearch: "",
        supplierId: actualOrder.data.supplierId,
      })
    );
    if (type == "ajuste") {
      dispatch(getOrderItemsRequest(actualOrder.data.id));
    }
  }, []);
  return (
    <AddProductToOrder
      {...props}
      methods={methods}
      onSubmit={searchProd}
      productPages={productPages}
      fnAdd={addProductToOrder}
      fnInfo={infoProduct}
      fnDelete={deleteOrder}
      fnUpdate={updateCantOrderItem}
      fnPrUpdate={updatePrecOrderItem}
      listOrder={listOrderItems.data}
      order={actualOrder}
      orderAjust={orderAjust}
      fnEnd={confirmOrder}
      path={pathname}
      goPath={useNavigate()}
      showAlert={showAlert}
    />
  );
}

export default AddProductToBuyOrderContainer;
