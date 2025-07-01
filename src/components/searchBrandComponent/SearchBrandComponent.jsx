import React, { useEffect } from "react";
import styles from "./searchBrand.module.css";
import Button from "react-bootstrap/Button";
import CustomModal from "../../commonds/customModal/CustomModal";
import BrandsTable from "../tables/brandsTable/BrandsTable";
import { getSupplierRequest } from "../../redux/supplier";
import AddBrandModalContainer from "../../containers/AddBrandModalContainer";
import { useDispatch } from "react-redux";

function SearchBrandComponent(props) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSupplierRequest());
  }, []);

  return (
    <div className={styles.formContainer}>
      <CustomModal
        title="Nueva marca"
        size="xl"
        actionButton={
          <Button style={{ marginBottom: "10px", width: "150px" }}>Nuevo</Button>
        }
        actionProps={{
          className: `${styles.buttonStyle} ${styles.buttonStyleNext}`,
          variant: "primary",
        }}
        bodyModal={(props) => <AddBrandModalContainer {...props} />}
      />
      <BrandsTable />
    </div>
  );
}

export default SearchBrandComponent;
