import React from "react";
import styles from "./searchUsers.module.css";
import UsersTable from "../tables/usersTable/UsersTable";
import CustomModal from "../../commonds/customModal/CustomModal";
import { Button } from "react-bootstrap";
import OtherFormContainer from "../../containers/OtherFormContainer";

function SearchUsersComponent(props) {
  return (
    <div className={styles.formContainer}>
      <CustomModal
        size="xl"
        title="Nuevo usuario"
        actionButton={
          <Button type="button" style={{ height: "35px", width: "100px", marginBottom: "5px" }}>
            Nuevo
          </Button>
        }
        actionProps={{
          className: `${styles.buttonStyle} ${styles.buttonStyleNext}`,
          variant: "primary",
        }}
        bodyModal={(props) => <OtherFormContainer {...props} />}
      />
      <UsersTable />
    </div>
  );
}

export default SearchUsersComponent;
