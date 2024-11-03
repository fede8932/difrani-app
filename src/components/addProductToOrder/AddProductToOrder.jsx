import React from "react";
import styles from "./addProduct.module.css";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import { FormProvider } from "react-hook-form";
import CustomInput from "../../commonds/input/CustomInput";
import CustomTable from "../../commonds/table/CustomTable";
import CustomDrawer from "../../commonds/drawer/CustomDrawer";
import AlertSuccess from "../../commonds/alertSuccess/AlerSuccess";

function AddProductToOrder(props) {
  const {
    setView,
    methods,
    onSubmit,
    productPages,
    fnAdd,
    fnInfo,
    fnDelete,
    fnUpdate,
    fnPrUpdate,
    listOrder,
    order,
    orderAjust,
    fnEnd,
    path,
    type,
    goPath,
    showAlert,
  } = props;
  // console.log(productPages.data);
  return (
    <FormProvider {...methods}>
      <form className={styles.addProductContainer}>
        <div className={styles.prodToOrderContainer}>
          <div className={styles.infoProvContainer}>
            <span className={styles.labelInfoProv}>
              <i className="fa-solid fa-file-signature"></i> Razon Social:
              <span className={styles.textInfoProv}>
                {order.data.supplier.razonSocial.toUpperCase()}
              </span>
            </span>
            <span className={styles.labelInfoProv}>
              <i className="fa-regular fa-id-card"></i> CUIT:
              <span className={styles.textInfoProv}>
                {order.data.supplier.cuit}
              </span>
            </span>
            <span className={styles.labelInfoProv}>
              <i className="fa-solid fa-store"></i> Nº de compra:
              <span className={styles.textInfoProv}>{order.data.numero}</span>
            </span>
            {type == "ajuste" ? (
              <div className={styles.infoCostoCont}>
                <span className={styles.precioLabel}>
                  <i className="fa-solid fa-file-invoice"></i> ID Ajuste:
                </span>
                <span className={styles.precioText}>{orderAjust.data.id}</span>
              </div>
            ) : null}
            <div className={styles.infoCostoCont}>
              <span className={styles.precioLabel}>
                <i className="fa-solid fa-money-bill"></i> Subtotal:
              </span>
              <span className={styles.precioText}>{`$ ${
                type == "ajuste"
                  ? orderAjust.data.subTotal
                  : order.data.subTotal
              }`}</span>
            </div>
            <div className={styles.infoCostoCont}>
              <span className={styles.precioLabel}>
                <i className="fa-solid fa-money-bill-trend-up"></i> IVA:
              </span>
              <span className={styles.precioText}>{`$ ${
                type == "ajuste"
                  ? (orderAjust.data.subTotal * 0.21).toFixed(2)
                  : (order.data.subTotal * 0.21).toFixed(2)
              }`}</span>
            </div>
            <div className={styles.infoCostoCont}>
              <span className={styles.precioLabel}>
                <i className="fa-solid fa-money-bill-1-wave"></i> Total:
              </span>
              <span className={styles.precioText}>{`$ ${
                type == "ajuste"
                  ? orderAjust?.data?.total?.toFixed(2)
                  : order.data.total.toFixed(2)
              }`}</span>
            </div>
          </div>
        </div>
        <div className={styles.tableProdContainerPrinc}>
          <div className={styles.searchContainer}>
            <span className={styles.subTitle}>Buscador de productos</span>
            <div className={styles.searchTableContainer}>
              <div className={styles.alertContainer}>
                {showAlert && (
                  <AlertSuccess text={"Actualizado"} visible={showAlert} />
                )}
              </div>
              <div className={styles.buttonSearchCotainer}>
                <div className={styles.inputSearchContainer}>
                  <CustomInput
                    name="dataSearch"
                    type="text"
                    width="medium"
                    placeholder="Artículo"
                    icon="fa-solid fa-magnifying-glass"
                    validate={{ required: true }}
                  />
                  <Button
                    type="button"
                    onClick={methods.handleSubmit(onSubmit)}
                    style={{
                      backgroundColor: "#673ab7",
                      border: "1px solid #673ab7",
                      height: "47px",
                      marginLeft: "20px",
                      width: "100px",
                    }}
                  >
                    {!productPages.loading ? (
                      "Buscar"
                    ) : (
                      <Spinner animation="border" variant="light" size="sm" />
                    )}
                  </Button>
                </div>
                <div className={styles.buttonInfoContainer}>
                  <CustomDrawer
                    type={type}
                    orderType="OC"
                    fnDelete={fnDelete}
                    fnUpdate={fnUpdate}
                    fnPrUpdate={fnPrUpdate}
                    listOrder={listOrder}
                    orderAjust={orderAjust}
                  />
                </div>
              </div>
              <div className={styles.tableProdContainer}>
                <CustomTable
                  type="search"
                  color="blue"
                  products={productPages.data}
                  fnAdd={fnAdd}
                  fnInfo={fnInfo}
                  colum={[
                    { title: "Artículo", width: "10%" },
                    { title: "Descripción", width: "50%" },
                    { title: "Marca", width: "10%" },
                    { title: "Precio Uni", width: "15%" },
                    { title: "Stock", width: "10%" },
                    { title: "Acción", width: "5%" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {path == "/edit/buy" ? null : (
            <Button
              className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
              variant="danger"
              onClick={() => {
                !type == "ajuste" ? setView("General") : goPath("/search/buy");
              }}
            >
              Atras
            </Button>
          )}
          <Button
            disabled={order.data.subTotal <= 0 ? true : false}
            className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
            variant="primary"
            onClick={() => {
              fnEnd();
            }}
          >
            Confirmar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default AddProductToOrder;
