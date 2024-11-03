import React from "react";
import styles from "./searchCurrentAcount.module.css";
import SearchCurrentAcountContainer from "../../containers/SearchCurrentAcountContainer";
// import { useLocation } from "react-router";

function SearchCurrentAcount() {
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Cuenta corriente</h6>
      <SearchCurrentAcountContainer />
    </div>
  );
}

export default SearchCurrentAcount;
