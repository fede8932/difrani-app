import React from "react";
import styles from "./sale.module.css";
import BrandSaleContainer from "../../containers/BrandSaleContainer";
import ProductSaleContainer from "../../containers/ProductSaleContainer";
import BrandPaymentDiscountContainer from "../../containers/BrandPaymentDiscountContainer";
import { Tab, TabPane } from "semantic-ui-react";
import LanzamientosComponent from "../../components/lanzamiento/LanzamientosComponent";
import AvisosComponent from "../../components/avisos/AvisosComponent";

function BrandSale(props) {
  const { type } = props;
  const productPanes = [
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
        {type == "product" ? (
          <Tab panes={productPanes} />
        ) : (
          <Tab
            panes={[
              {
                menuItem: "Administración de oferta",
                render: () => (
                  <TabPane>
                    <BrandSaleContainer />
                  </TabPane>
                ),
              },
              {
                menuItem: "Descuentos por medio de pago",
                render: () => (
                  <TabPane>
                    <BrandPaymentDiscountContainer />
                  </TabPane>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

export default BrandSale;
