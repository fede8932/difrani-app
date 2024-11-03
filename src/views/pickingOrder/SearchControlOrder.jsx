import React from "react";
import styles from "./searchPickingOrder.module.css";
import SearchPickingOrderContainer from "../../containers/SearchPickingOrderContainer";
import { Checkbox } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterPickinngs } from "../../redux/filtersPickings";

function SearchPickingOrder() {
  const filters = useSelector((state) => state.filterPickings);
  const dispatch = useDispatch();
  const togglePending = () => {
    dispatch(setFilterPickinngs({ name: "pending", value: !filters.pending }));
    dispatch(setFilterPickinngs({ name: "page", value: 1 }));
  };

  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Ordenes de pedidos</h6>
      <Checkbox
        checked={filters.pending}
        label="Pendiente"
        toggle
        onClick={togglePending}
      />
      <div>
        <SearchPickingOrderContainer />
      </div>
    </div>
  );
}

export default SearchPickingOrder;
