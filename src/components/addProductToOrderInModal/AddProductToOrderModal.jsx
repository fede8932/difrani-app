import { useDispatch, useSelector } from "react-redux";
import styles from "./addProductToOrder.module.css";
import { addOrderItemsRequest } from "../../redux/addOrderItems";
import { getBuyOrderRequest } from "../../redux/newOrder";
import { setPendingSave } from "../../redux/pendingSave";
import { Button } from "react-bootstrap";
import { useMemo, useState } from "react";

function AddProductToOrderModal(props) {
  const { data, closeModal, typeOrder } = props; //typeOrder es sell o buy

  const [inputValue, setInputValue] = useState("");

  const disabled = useMemo(
    () =>
      inputValue == "" ||
      isNaN(inputValue) ||
      !Number.isInteger(Number(inputValue)),
    [inputValue]
  );

  const actualOrder = useSelector((state) => state.newBuyOrder);

  const dispatch = useDispatch();

  const addProductToOrder = () => {
    const objSend = {
      productId: data.id,
      brandId: data.brandId,
      orderId: actualOrder.data.id,
      cantidad: inputValue,
      type: typeOrder,
    };
    dispatch(addOrderItemsRequest(objSend)).then(() => {
      dispatch(getBuyOrderRequest(actualOrder.data.id)).then(() => {
        closeModal();
      });
      dispatch(setPendingSave({ pending: false, orderId: null }));
    });
  };
  return (
    <div className={styles.container}>
      <input
        className={`${styles.input} form-control`}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button type="button" disabled={disabled} onClick={addProductToOrder}>
        Agregar
      </Button>
    </div>
  );
}

export default AddProductToOrderModal;
