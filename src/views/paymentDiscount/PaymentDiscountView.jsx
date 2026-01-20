import React from "react";
import styles from "./paymentDiscount.module.css";
import PaymentDiscountContainer from "../../containers/PaymentDiscountContainer";

function PaymentDiscountView() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Descuentos por medio de pago</h6>
      <PaymentDiscountContainer />
    </div>
  );
}

export default PaymentDiscountView;
