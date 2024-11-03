import React, { useState } from "react";
import styles from "./searchProduct.module.css";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { useNavigate } from "react-router";
import ProtectedComponent from "../../protected/protectedComponent/ProtectedComponent";
import { useSelector } from "react-redux";
import { getFileProducts } from "../../request/productRequest";
import ProductsTable from "../tables/productsTable/ProductsTable";

function SearchProductComponent(props) {
  const { resetSearch, deleteProduct } = props;

  const user = useSelector((state) => state.user);

  const filterProducts = useSelector((state) => state.filterProduct);
  const [listDownloadPending, setListDownloadPending] = useState(false);

  const downloadFile = async () => {
    setListDownloadPending(true);
    try {
      const response = await getFileProducts(filterProducts);

      // Crea un objeto URL a partir del objeto Blob
      const fileURL = URL.createObjectURL(new Blob([response.data]));

      // Extrae el nombre del archivo de la cabecera 'content-disposition'
      const fileName = response.headers["content-disposition"]
        ? response.headers["content-disposition"]
            .split(";")
            .find((n) => n.includes("filename="))
            .replace("filename=", "")
            .replace(/"/g, "") // Elimina las comillas del nombre del archivo
        : "products.xlsx"; // Nombre predeterminado del archivo

      // Crea un enlace (a) para descargar el archivo
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", fileName); // Establece el nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    } finally {
      {
        setListDownloadPending(false);
      }
    }
  };

  // console.log(user);

  const navigate = useNavigate();
  // console.log(tabProducts(products.data));
  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <Button
          disabled={listDownloadPending}
          type="button"
          style={{
            backgroundColor: "grey",
            border: "1px solid grey",
            height: "47px",
            width: "100px",
            marginLeft: "10px",
          }}
          onClick={downloadFile}
        >
          {listDownloadPending ? <Spinner /> : "Exportar"}
        </Button>
      </div>
      <div className={styles.table}>
        <ProductsTable deleteProduct={deleteProduct} />
      </div>
    </div>
  );
}

export default SearchProductComponent;
