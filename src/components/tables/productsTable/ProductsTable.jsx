import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetProductSearch,
  searchProductsExtraRequest,
} from "../../../redux/product";
import { redondearADosDecimales } from "../../../utils";
import { Pagination, Select } from "semantic-ui-react";
import styles from "./productsTables.module.css";
import ActionModalContainer from "../../../containers/ActionModalContainer";
import ProtectedComponent from "../../../protected/protectedComponent/ProtectedComponent";
import CustomModal from "../../../commonds/customModal/CustomModal";
import EditProductContainer from "../../../containers/EditProductContainer";
import IconButonUsersTable from "../../../commonds/iconButtonUsersTable/IconButonUsersTable";
import { useNavigate } from "react-router";
import {
  resetFilterProduct,
  setFilterProduct,
} from "../../../redux/filtersProducts";

const CustomComp = ({ data, props }) => {
  const { deleteProduct } = props;
  const navigate = useNavigate();
  return (
    <div className={styles.buttonContainer}>
      <ActionModalContainer
        type="infoProduct"
        icon="fa-regular fa-images"
        size="lg"
        popupText="Ver imágenes"
        images={data.images}
      />
      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <CustomModal
          title="Editar Producto"
          size="lg"
          actionButton={
            <buton className={styles.iconB}>
              <i class="fa-regular fa-pen-to-square"></i>
            </buton>
          }
          bodyModal={(props) => (
            <EditProductContainer {...props} id={data.id} />
          )}
        />
      </ProtectedComponent>

      <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
        <IconButonUsersTable
          popupText="Equivalencias"
          fn={() => {
            navigate(`/equivalences/${data.id}`);
          }}
          icon="fa-solid fa-scale-balanced"
          iconInitialStyle="iconStyleTeal"
        />
      </ProtectedComponent>
      <ProtectedComponent listAccesss={[1, 2]}>
        <IconButonUsersTable
          popupText="Eliminar"
          fn={() => deleteProduct(data.id)}
          icon="fa-regular fa-trash-can"
          iconInitialStyle="iconStyleRed"
        />
      </ProtectedComponent>
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
      dispatch(setFilterProduct({ name: "page", value: 1 }));
      dispatch(setFilterProduct({ name, value }));
      if (value === "") {
        setInp(false);
      }
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

function ProductsTable(props) {
  const { deleteProduct } = props;
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
      headerName: "Costo",
      field: "price",
      valueGetter: (params) =>
        params.data.price ? `$ ${params.data.price.price}` : "",
      filter: false,
      width: 120,
      sortable: false,
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
      headerName: "Acciones",
      cellRenderer: (params) => (
        <CustomComp
          data={params.data}
          props={{ deleteProduct: deleteProduct }}
        />
      ),
      field: "id",
      sortable: false,
      filter: false,
      width: 125,
    },
    {
      headerName: "Precio",
      field: "sellPrice",
      sortable: false,
      valueGetter: (params) =>
        params.data.price && params.data.brand
          ? `$ ${redondearADosDecimales(
              params.data.price.price * (1 + params.data.brand.rentabilidad)
            )}`
          : "",
      filter: false,
      width: 125,
    },
    {
      headerName: "Precio cIva",
      field: "sellPriceIva",
      sortable: false,
      valueGetter: (params) =>
        params.data.price && params.data.brand
          ? `$ ${redondearADosDecimales(
              params.data.price.price *
                (1 + params.data.brand.rentabilidad) *
                1.21
            )}`
          : "",
      filter: false,
      width: 155,
    },
    {
      headerName: "Ubicación",
      field: "location",
      sortable: false,
      filter: false,
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

  const selectChange = (e, d) => {
    dispatch(setFilterProduct({ name: "pageSize", value: d.value }));
  };
  const changePage = (e, d) => {
    dispatch(setFilterProduct({ name: "page", value: d.activePage }));
  };

  return (
    <div className={"ag-theme-quartz"} style={{ height: 665 }}>
      <AgGridReact
        rowData={products.data.list}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
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

export default ProductsTable;
