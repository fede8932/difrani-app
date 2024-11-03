import React, { useEffect, useState } from "react";
import styles from "./searchSellOrder.module.css";
import SearchOrderContainer from "../../containers/SearchOrderContainer";
import { Button, Checkbox } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { sellOrderButtonConfirm, sellOrderButtonUnif } from "../../utils";
import Swal from "sweetalert2";
import {
  confirmSelectSellOrderRequest,
  unificSelectSellOrderRequest,
} from "../../redux/searchOrders";
import { setFilterSellOrder } from "../../redux/filtersSellOrder";

function SearchSellOrder() {
  const { loading, error, data } = useSelector((state) => state.searchOrders);
  const filterSellOrder = useSelector((state) => state.filterSellOrder);
  // console.log(filterSellOrder);
  const [confirm, setConfirm] = useState(false);
  const [conUnif, setUnif] = useState(false);
  const dispatch = useDispatch();

  const onAllConfirm = () => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Vas a confirmas las ordenes seleccionadas",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        const send = { orderIdList: [] };
        data.list.map((item) => {
          if (item.marc) {
            send.orderIdList.push(item.id);
          }
        });
        dispatch(confirmSelectSellOrderRequest(send)).then((res) => {
          // console.log(res);
          if (res?.error) {
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: `${res.error?.message}`,
            });
          } else {
            Swal.fire({
              title: "Confirmado",
              text: "Las ventas se confirmaron de manera exitosa",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const onAllUnif = () => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Vas a unificar las ordenes seleccionadas",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        const send = { orderIdList: [] };
        data.list.map((item) => {
          if (item.marc) {
            send.orderIdList.push(item.id);
          }
        });
        dispatch(unificSelectSellOrderRequest(send)).then((res) => {
          // console.log(res);
          if (res?.error) {
            console.log(res);
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: `${res.error?.message}`,
            });
          } else {
            Swal.fire({
              title: "Confirmado",
              text: "Las ordenes se unificaron",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const pendingFilterToggle = () => {
    dispatch(setFilterSellOrder({ name: "page", value: 1 }));
    dispatch(
      setFilterSellOrder({ name: "pending", value: !filterSellOrder.pending })
    );
  };

  useEffect(() => {
    setConfirm(sellOrderButtonConfirm(data.list));
    setUnif(sellOrderButtonUnif(data.list));
  }, [data]);
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Buscador de ordenes de venta</h6>
      <div style={{ marginTop: "50px" }}>
        <div className={styles.buttonContainer}>
          <div>
            <Checkbox
              checked={filterSellOrder.pending}
              toggle
              label="Pendiente"
              onClick={pendingFilterToggle}
            />
          </div>
          <div>
            <Button disabled={!confirm} color="green" onClick={onAllConfirm}>
              Confirmar
            </Button>
            <Button disabled={!conUnif} color="teal" onClick={onAllUnif}>
              Unificar
            </Button>
          </div>
        </div>
        <SearchOrderContainer type="Sell" />
      </div>
    </div>
  );
}

export default SearchSellOrder;
