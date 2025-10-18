import React from "react";
import styles from "./sidebar.module.css";
import CustomButton from "../../commonds/button/CustomButton";
import Separador from "../../commonds/separador/Separador";
import CustomAcordion from "../../commonds/acordion/CustomAcordion";
import { falseNotificStatus } from "../../redux/webSocketNotification";
import { useDispatch } from "react-redux";
import ProtectedComponent from "../../protected/protectedComponent/ProtectedComponent";

function SideBarComponent(props) {
  const { status, fnNavigate, notific } = props;
  const { newSell } = notific;
  const dispatch = useDispatch();

  return (
    <div
      className={`${styles.sidebarContainer} ${
        status ? "" : `${styles.close}`
      }`}
    >
      <ProtectedComponent listAccesss={[1]}>
        <div className={styles.section}>
          <h5 className={styles.sideTitle}>DASHBOARD</h5>
          <CustomButton
            props={{
              buttonStyle: "sideOptionButton",
              icon: "fas fa-tachometer-alt",
              iconStyle: "sideIconGri",
              iconHoverStyle: "sideIconVio",
              textButton: "DASHBOARD",
              fnSidebar: () => {
                fnNavigate("/");
              },
            }}
          />
          <CustomButton
            props={{
              buttonStyle: "sideOptionButton",
              icon: "fa-solid fa-industry",
              iconStyle: "sideIconGri",
              iconHoverStyle: "sideIconVio",
              textButton: "PRODUCCIÓN",
              fnSidebar: () => {
                window.open("https://admin.difrani.com", "_blank");
              },
            }}
          />
        </div>
      </ProtectedComponent>
      {/* <Separador props={{ clase: "sideSeparador" }} />
      <div className={styles.section}>
        <h5 className={styles.sideTitle}>Registrar</h5>
        <CustomAcordion
          props={{
            textButton: "Usuarios",
            icon01: "fa-solid fa-user",
            items: [
              {
                textButton: "Registrar vendedor",
                fn: () => {
                  fnNavigate("/add/seller");
                },
              },
              {
                textButton: "Registrar cliente",
                fn: () => {
                  fnNavigate("/add/client");
                },
              },
              {
                textButton: "Registrar proveedor",
                fn: () => {
                  fnNavigate("/add/supplier");
                },
              },
              {
                textButton: "Registrar usuario",
                fn: () => {
                  fnNavigate("/add/user");
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: "Marca Producto",
            icon01: "fa fa-box",
            items: [
              {
                textButton: "Registrar marca",
                fn: () => {
                  fnNavigate("/add/brand");
                },
              },
              {
                textButton: "Registrar producto",
                fn: () => {
                  fnNavigate("/add/product");
                },
              },
            ],
          }}
        />
      </div> */}
      <Separador props={{ clase: "sideSeparador" }} />
      <div className={styles.section}>
        <h5 className={styles.sideTitle}>ADMINISTRACIÓN</h5>
        <CustomAcordion
          props={{
            textButton: "USUARIOS",
            icon01: "fa fa-smile",
            items: [
              {
                textButton: "BUSCAR VENDEDOR",
                fn: () => {
                  fnNavigate("search/seller");
                },
              },
              {
                textButton: "BUSCAR CLIENTE",
                fn: () => {
                  fnNavigate("search/client");
                },
              },
              {
                textButton: "BUSCAR USUARIOS",
                fn: () => {
                  fnNavigate("search/users");
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: "PROVEEDORES",
            icon01: "fa fa-dolly",
            items: [
              {
                textButton: "BUSCAR PROVEEDOR",
                fn: () => {
                  fnNavigate("search/supplier");
                },
              },
              {
                textButton: "REPRESENTANTES",
                fn: () => {
                  fnNavigate("search/supplier/representative");
                },
              },
            ],
          }}
        />
      </div>
      <Separador props={{ clase: "sideSeparador" }} />
      <div className={styles.section}>
        <h5 className={styles.sideTitle}>REGISTROS</h5>
        <CustomAcordion
          props={{
            textButton: "MARCA PRODUCTO",
            icon01: "fa-solid fa-box-open",
            items: [
              {
                textButton: "MARCAS",
                fn: () => {
                  fnNavigate("/search/brand");
                },
              },
              {
                textButton: "PRODUCTOS",
                fn: () => {
                  fnNavigate("/search/product");
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: "COMPRAS",
            icon01: "fa fa-tag",
            items: [
              {
                textButton: "NUEVA ORDEN DE COMPRA",
                fn: () => {
                  fnNavigate("/new/buy");
                },
              },
              {
                textButton: "BUSCAR ORDEN DE COMPRA",
                fn: () => {
                  fnNavigate("/search/buy");
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            notific: { notific: newSell.data, index: 1 },
            textButton: "VENTAS",
            icon01: "fa fa-smile",
            items: [
              {
                textButton: "NUEVO PEDIDO",
                fn: () => {
                  fnNavigate("/new/sell");
                },
              },
              {
                textButton: "BUSCAR PEDIDOS",
                fn: () => {
                  fnNavigate("/search/sell");
                  dispatch(falseNotificStatus());
                },
              },
              {
                textButton: "REPORTE DE VENTAS",
                fn: () => {
                  fnNavigate("/report/sell");
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: "PICKING",
            icon01: "fa fa-dolly",
            items: [
              {
                textButton: "BUSCAR ORDEN DE CONTROL",
                fn: () => {
                  fnNavigate("/control/orden");
                },
              },
              {
                textButton: "BUSCAR ORDEN DE PEDIDO",
                fn: () => {
                  fnNavigate("/picking/orden");
                },
              },
            ],
          }}
        />
        <CustomAcordion
          props={{
            textButton: "PENDIENTES",
            icon01: "fa-solid fa-business-time",
            items: [
              {
                textButton: "LISTA DE PENDIENTES",
                fn: () => {
                  fnNavigate("/pending");
                },
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default SideBarComponent;
