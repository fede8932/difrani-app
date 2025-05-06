import React, { useEffect, useState } from "react";
import EditStock from "../components/editStock/EditStock";
import { useDispatch, useSelector } from "react-redux";
import {
  resetControlItems,
  selectControlOrderItemsRequest,
  updteControlItem,
} from "../redux/selectControlOrderItems";
import { updateStock } from "../request/productRequest";
import { updateControlOrderRequest } from "../redux/supplierControlOrder";
import Swal from "sweetalert2";

function EditStockContainer({ id, close }) {
  const controlOrder = useSelector((state) => state.selectControlOrderItems);
  const dispatch = useDispatch();

  const updateAmount = async (data) => {
    dispatch(updteControlItem(data));
  };
  const [loading, setLoading] = useState(false);

  const confirmFn = async (controlOrderId, stockBool) => {
    setLoading(true);
    try {
      if (stockBool) {
        await updateStock({
          items: controlOrder.data.items,
          controlOrderId: controlOrderId,
        });
      }
      dispatch(updateControlOrderRequest(controlOrderId))
        .then(() => {
          close();
        })
        .then(() => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: stockBool ? "Stock actualizado" : "El stock no se actualizó",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error: ${err.message}`,
          });
        });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const confirm = (controlOrderId) => {
    Swal.fire({
      title: "Vas confirmar la nota de control",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Agregar a stock",
      denyButtonText: `No agregar a stock`,
    }).then((result) => {
      if (result.isConfirmed) {
        confirmFn(controlOrderId, true);
      } else if (result.isDenied) {
        confirmFn(controlOrderId, false);
      }
    });
  };

  useEffect(() => {
    dispatch(
      selectControlOrderItemsRequest({
        id: id,
      })
    );
    return () => {
      dispatch(resetControlItems(null));
    };
  }, []);

  return (
    <EditStock
      order={controlOrder.data}
      onClick={confirm}
      updateAmount={updateAmount}
      loading={loading}
    />
  );
}

export default EditStockContainer;
