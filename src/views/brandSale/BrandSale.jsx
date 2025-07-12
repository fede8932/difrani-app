import React from "react";
import styles from "./sale.module.css";
import BrandSaleContainer from "../../containers/BrandSaleContainer";
import ProductSaleContainer from "../../containers/ProductSaleContainer";
import { Tab, TabPane } from "semantic-ui-react";
import LanzamientosComponent from "../../components/lanzamiento/LanzamientosComponent";
import AvisosComponent from "../../components/avisos/AvisosComponent";

function BrandSale(props) {
  const { type } = props;
  const panes = [
    {
      menuItem: "Ofertas",
      render: () => (
        <TabPane>
          <ProductSaleContainer />
        </TabPane>
      ),
    },
    {
      menuItem: "Lanzamientos",
      render: () => <LanzamientosComponent />,
    },
    {
      menuItem: "Avisos",
      render: () => <AvisosComponent />,
    },
  ];
  return (
    <div className={styles.addUserContainer}>
      <h6 className={styles.formTitle}>Configuración de ofertas</h6>
      <div>
        {type == "product" ? <Tab panes={panes} /> : <BrandSaleContainer />}
      </div>
    </div>
  );
}

export default BrandSale;
