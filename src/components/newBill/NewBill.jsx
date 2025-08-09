import React, { useState } from "react";
import styles from "./newBill.module.css";
import {
  dateConverter,
  numberToString,
  redondearADosDecimales,
} from "../../utils";
import CustomTable from "../../commonds/table/CustomTable";
import { Button, Spinner } from "react-bootstrap";
import { Checkbox } from "semantic-ui-react";

function NewBill(props) {
  const {
    client,
    order,
    onSubmit,
    listOrder,
    addItemToBill,
    totalFac,
    totalNoFac,
    loading,
    f50p50,
    setF50p50,
    facturarTotal,
  } = props;
  return (
    <div className={styles.facContainer}>
      <div className={styles.dataContainer}>
        <span style={{ width: "33%" }}>
          Fecha:{" "}
          <span className={styles.datosSpan}>{dateConverter(new Date())}</span>
        </span>
        <span
          style={{ width: "33%", display: "flex", justifyContent: "center" }}
        >
          CUIT: <span className={styles.datosSpan}>{client.cuit}</span>
        </span>
        <span style={{ width: "33%", display: "flex", justifyContent: "end" }}>
          Razon Social:{" "}
          <span className={styles.datosSpan}>{client.razonSocial}</span>
        </span>
      </div>
      <div className={styles.dataContainer}>
        <span style={{ width: "33%" }}>
          Orden: <span className={styles.datosSpan}>{order.numero}</span>
        </span>
        <span
          style={{ width: "33%", display: "flex", justifyContent: "center" }}
        >
          Subtotal:{" "}
          <span
            className={styles.datosSpan}
          >{`$ ${numberToString(order.subTotal)}`}</span>
        </span>
        <span style={{ width: "33%", display: "flex", justifyContent: "end" }}>
          Total:{" "}
          <span
            className={styles.datosSpan}
          >{`$ ${numberToString(order.total)}`}</span>
        </span>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.message}>
          Seleccioná aquellos items que deben incluirse en la factura oficial
        </div>
      </div>
      <div style={{ margin: "5px 0px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Checkbox
          label="Facturar 50/50"
          checked={f50p50}
          onChange={() => setF50p50(!f50p50)}
        />
        <div>
          <Button type="button" onClick={() => facturarTotal()}>Facturar total</Button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <CustomTable
          f50p50={f50p50}
          type="fact"
          color="teal"
          products={listOrder}
          addItemToBill={addItemToBill}
          colum={[
            { title: "Artículo", width: "20%" },
            { title: "Marca", width: "22%" },
            { title: "Cantidad", width: "10%" },
            { title: "Precio Uni", width: "22%" },
            { title: "IVA", width: "16%" },
            { title: "Facturar", width: "10%" },
          ]}
        />
      </div>
      <div className={styles.buttonContainer}>
        <div>
          <div>
            <span>
              Total Facturado:
              {f50p50 ? null : (
                <span className={styles.datosSpan}>{`$ ${redondearADosDecimales(
                  totalFac
                )}`}</span>
              )}
            </span>
          </div>
          <div>
            <span>
              Total Presupuesto:
              {f50p50 ? null : (
                <span className={styles.datosSpan}>{`$ ${redondearADosDecimales(
                  totalNoFac
                )}`}</span>
              )}
            </span>
          </div>
        </div>
        <Button
          onClick={() => {
            onSubmit();
          }}
          style={{
            backgroundColor: "#673ab7",
            border: "1px solid #673ab7",
            height: "35px",
            width: "100px",
            marginLeft: "10px",
          }}
        >
          {loading ? <Spinner size="sm" /> : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}

export default NewBill;
