import React, { useEffect, useState } from "react";
import EditStock from "../components/editStock/EditStock";
import { useDispatch, useSelector } from "react-redux";
import {
  selectControlOrderItemsRequest,
  updateItemsRequest,
} from "../redux/selectControlOrderItems";
import { updateStock } from "../request/productRequest";
import { updateControlOrderRequest } from "../redux/supplierControlOrder";

function EditStockContainer({ id, close }) {
  const controlOrder = useSelector((state) => state.selectControlOrderItems);
  const dispatch = useDispatch();

  const itemsPorPag = 11; // defino cantidad de items

  const [activePage, setActivePage] = useState(1);
  const [confirmButton, setConfirmButton] = useState(true);
  const handlePageChange = (activePage) => {
    dispatch(
      selectControlOrderItemsRequest({
        id: id,
        rows: itemsPorPag,
        page: activePage,
      })
    ).then(() => {
      setActivePage(activePage);
      if (controlOrder.data.pages === activePage) {
        setConfirmButton(false);
      }
    });
  };

  const updateAmount = async (data) => {
    dispatch(updateItemsRequest(data));
  };

  const confirm = async (controlOrderId) => {
    try {
      await updateStock({ items: controlOrder.data.items });
      dispatch(updateControlOrderRequest(controlOrderId)).then(() => {
        close();
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(
      selectControlOrderItemsRequest({
        id: id,
        rows: itemsPorPag,
        page: 1,
      })
    ).then(() => {
      if (controlOrder.data.pages === 1) {
        setConfirmButton(false);
      }
    });
  }, []);

  return (
    <EditStock
      order={controlOrder.data}
      handlePageChange={handlePageChange}
      activePage={activePage}
      confirmButton={confirmButton}
      onClick={confirm}
      updateAmount={updateAmount}
    />
  );
}

export default EditStockContainer;
