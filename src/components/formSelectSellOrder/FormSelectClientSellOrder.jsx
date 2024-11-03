import React from "react";
import styles from "./formSelect.module.css";
import ClientAcordion from "../../commonds/clientAcordion/ClientAcordion";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router";

function FormSelectClientSellOrder(props) {
  const { setView, client, confirmFn, type } = props;
  // console.log("VER CLIENT ====>>>", client);
  const navigate = useNavigate();
  return (
    <div className={styles.formContainer}>
      <div className={styles.buttonSubFormContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Datos de cliente</span>
            <div>
              <ClientAcordion client={client} type={type} />
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
            variant="danger"
            onClick={() => {
              type == "sale" ? navigate("/") : setView("Productos");
            }}
          >
            {type == "sale" ? "Cancelar" : "Atras"}
          </Button>
          <Button
            disabled={client ? false : true}
            className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
            onClick={confirmFn}
          >
            {type == "sale" ? "Siguiente" : "Confirmar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormSelectClientSellOrder;
