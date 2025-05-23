import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProductsExtraRequest } from "../../../redux/product";
import { discountApplication, numberToString } from "../../../utils";
import { Pagination, Select } from "semantic-ui-react";
import styles from "./productsTables.module.css";
import ProtectedComponent from "../../../protected/protectedComponent/ProtectedComponent";
import CustomModal from "../../../commonds/customModal/CustomModal";
import IconButonUsersTable from "../../../commonds/iconButtonUsersTable/IconButonUsersTable";
import {
  resetEquivFilter,
  resetFilterProduct,
  setEquivFilter,
  setFilterProduct,
} from "../../../redux/filtersProducts";
import AddProductToOrderModal from "../../addProductToOrderInModal/AddProductToOrderModal";

const CustomComp = ({ data, props }) => {
  const { typeOrder } = props;
  return (
    <div className={styles.buttonContainer}>
      <CustomModal
        title="Agregar producto"
        size="sm"
        actionButton={
          <div
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("enter");
                e.preventDefault(); // previene efectos secundarios
                e.stopPropagation(); // evita burbujeo innecesario
                e.target.click(); // simula click
              }
            }}
          >
            <i
              className={`fa-solid fa-arrow-right-to-bracket ${styles.iconStyleBlue}`}
            ></i>
          </div>
        }
        actionProps={{
          className: `${styles.buttonStyle} ${styles.buttonStyleNext}`,
          variant: "primary",
        }}
        bodyModal={(props) => (
          <AddProductToOrderModal
            data={data}
            typeOrder={typeOrder}
            {...props}
          />
        )}
      />
    </div>
  );
};

const Equivalences = ({ data, props }) => {
  const dispatch = useDispatch();
  const { equivalenceId } = useSelector((state) => state.filterProduct);
  // console.log(equivalenceId);
  return (
    <div className={styles.buttonContainer}>
      <IconButonUsersTable
        disabled={/*!data.equivalenceId*/ true}
        popupText={equivalenceId ? "Quitar filtro" : "Ver equivalencias"}
        fn={() => {
          equivalenceId
            ? dispatch(resetEquivFilter())
            : dispatch(setEquivFilter(data.equivalenceId));
        }}
        icon={
          /*equivalenceId*/ false
            ? "fa-regular fa-eye-slash"
            : "fa-regular fa-eye"
        }
        iconInitialStyle={
          /*!data.equivalenceId*/ true
            ? "iconStyleGrey"
            : equivalenceId
              ? "iconStyleRed"
              : "iconStyleBlue"
        }
      />
    </div>
  );
};

const HeaderInput = (props) => {
  const { title, name } = props;
  const dispatch = useDispatch();
  const filterProducts = useSelector((state) => state.filterProduct);
  const [inp, setInp] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(filterProducts[name]);
  const inputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const onTitleClick = () => {
    setInp(true);
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    setDebouncedValue(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(setFilterProduct({ name: "equivalenceId", value: null }));
      dispatch(setFilterProduct({ name: "page", value: 1 }));
      dispatch(setFilterProduct({ name, value }));
      // if (value === '') {
      //   setInp(false);
      // }
    }, 500); // El valor 500 representa el tiempo de espera en milisegundos
  };

  const handleClickOutside = () => {
    if (!filterProducts[name]) {
      setInp(false);
    }
  };

  useEffect(() => {
    if (inp && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inp]);

  useEffect(() => {
    if (inp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterProducts, inp]);

  return inp ? (
    <input
      ref={inputRef}
      className={styles.input}
      value={debouncedValue}
      onChange={onInputChange}
    />
  ) : (
    <span onClick={onTitleClick}>{title}</span>
  );
};

function AddProductsTable(props) {
  const { supplierId, typeOrder, customerDiscounts } = props;
  const filterProducts = useSelector((state) => state.filterProduct);

  const dispatch = useDispatch();

  const products = useSelector((state) => state.product);

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Artículo",
      field: "article",
      headerComponent: () => <HeaderInput title="Artículo" name={"article"} />,
      width: 150,
      filterParams: {
        filterOptions: ["contains"], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: "Acciones",
      cellRenderer: (params) => (
        <CustomComp data={params.data} props={{ typeOrder: typeOrder }} />
      ),
      field: "id",
      sortable: false,
      filter: false,
      width: 125,
    },
    {
      headerName: "Stock",
      field: "stock",
      valueGetter: (params) =>
        params.data.stock ? params.data.stock.stock : "",
      filter: false,
      width: 90,
    },
    {
      headerName: "Descripción",
      field: "description",
      headerComponent: () => (
        <HeaderInput title="Descripción" name={"description"} />
      ),
      width: 650,
      filterParams: {
        filterOptions: ["contains"], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: "Marca",
      field: "brand",
      headerComponent: () => <HeaderInput title="Marca" name={"brand"} />,
      valueGetter: (params) =>
        params.data.brand ? params.data.brand.name : "",
      filterParams: {
        filterOptions: ["contains"], // Solo opción 'contains'
        suppressFilterButton: true, // Ocultar el botón del menú del filtro
      },
    },
    {
      headerName: supplierId ? "Costo" : "Precio",
      field: "price",
      cellRenderer: (params) => (
        <ProtectedComponent listAccesss={[1, 2]}>
          {supplierId ? (
            <span>
              {params.data.price
                ? `$ ${numberToString(params.data.price.price)}`
                : ""}
            </span>
          ) : (
            <span>
              {`$ ${numberToString(
                discountApplication(customerDiscounts, params.data).initPrice
              )}`}
            </span>
          )}
        </ProtectedComponent>
      ),
      filter: false,
      width: 135,
      sortable: false,
    },
    {
      headerName: "Equivalencias",
      cellRenderer: (params) => <Equivalences data={params.data} />,
      field: "id",
      sortable: false,
      filter: false,
      width: 135,
    },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      // filter: "agTextColumnFilter",
      // floatingFilter: true,
    };
  }, []);

  useEffect(() => {
    dispatch(searchProductsExtraRequest(filterProducts));
    return () => {
      // dispatch(resetProductSearch());
      // dispatch(resetFilterProduct());
    };
  }, [filterProducts]);

  useEffect(() => {
    if (supplierId) {
      dispatch(setFilterProduct({ name: "supplierId", value: supplierId }));
      return () => {
        dispatch(setFilterProduct({ name: "supplierId", value: null }));
      };
    }
  }, [supplierId]);

  useEffect(() => {
    return () => {
      dispatch(resetFilterProduct());
    };
  }, [supplierId]);

  const selectChange = (e, d) => {
    dispatch(setFilterProduct({ name: "pageSize", value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterProduct({ name: "page", value: d.activePage }));
  };

  return (
    <div className={"ag-theme-quartz"} style={{ height: 495 }}>
      <div className={"ag-theme-quartz"} style={{ height: "90%" }}>
        <AgGridReact
          rowData={products.data.list}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
      <div className={styles.paginationContainer}>
        <span>{`Se encontraron ${products.data.totalPages} páginas con ${products.data.totalRows} resultados.`}</span>
        <div className={styles.pagination}>
          <div style={{ marginRight: "10px" }}>
            <Select
              width="10px"
              defaultValue={filterProducts.pageSize}
              onChange={selectChange}
              options={[
                { key: 20, value: 20, text: 20 },
                { key: 50, value: 50, text: 50 },
                { key: 100, value: 100, text: 100 },
              ]}
            />
          </div>
          <Pagination
            boundaryRange={0}
            activePage={filterProducts.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={products.data.totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}

export default AddProductsTable;
