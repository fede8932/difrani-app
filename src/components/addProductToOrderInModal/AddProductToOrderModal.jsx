import { useDispatch, useSelector } from "react-redux";
import styles from "./addProductToOrder.module.css";
import { addOrderItemsRequest } from "../../redux/addOrderItems";
import { getBuyOrderRequest } from "../../redux/newOrder";
import { setPendingSave } from "../../redux/pendingSave";
import { Button } from "react-bootstrap";
import { useEffect, useMemo, useRef, useState } from "react";

function AddProductToOrderModal(props) {
  const { data, closeModal, typeOrder } = props; //typeOrder es sell o buy

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null); // 👈 referenciar el input

  const disabled = useMemo(
    () =>
      inputValue == "" ||
      isNaN(inputValue) ||
      !Number.isInteger(Number(inputValue)),
    [inputValue]
  );

  const actualOrder = useSelector((state) => state.newBuyOrder);

  const dispatch = useDispatch();

  const addProductToOrder = (e) => {
    e.preventDefault();
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

  useEffect(() => {
    // 👇 hacer foco cuando el componente se monta
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form className={styles.container} onSubmit={addProductToOrder}>
      <input
        ref={inputRef} // 👈 asignar ref acá
        className={`${styles.input} form-control`}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button type="submit" disabled={disabled}>
        Agregar
      </Button>
    </form>
  );
}

export default AddProductToOrderModal;
