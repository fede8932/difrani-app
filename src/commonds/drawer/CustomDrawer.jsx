import React, { useState } from 'react';
import styles from './customDrawer.module.css';
import { Drawer, Space } from 'antd';
import InfoButton from '../infoButton/InfoButton';
import CustomTable from '../table/CustomTable';
const CustomDrawer = (props) => {
  const {
    type,
    orderType,
    fnDelete,
    fnUpdate,
    fnPrUpdate,
    listOrder,
    orderAjust,
  } = props;

  // console.log(listOrder); // Llega OK
  // console.log(orderAjust);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <InfoButton
        text={orderType === 'OC' ? 'Dellade de compra' : 'Detalle de venta'}
        onClick={showDrawer}
      />
      <Drawer
        title={
          orderType === 'OC'
            ? 'Detalle de orden de compra'
            : 'Detalle de orden de venta'
        }
        width={820}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={<Space></Space>}
      >
        <div>
          {orderType === 'OC' ? (
            <div>
              <div className={styles.listContainer}>
                <span className={styles.subTitle}>Productos en orden</span>
                <div className={styles.prodToOrderContainer}>
                  <CustomTable
                    objective={type}
                    type="list"
                    fnDelete={fnDelete}
                    color="teal"
                    products={
                      type !== 'ajuste'
                        ? listOrder
                        : orderAjust.data.ajustOrderItems
                    }
                    fnUpdate={fnUpdate}
                    fnPrUpdate={fnPrUpdate}
                    colum={[
                      { title: 'Artículo', width: '26%' },
                      { title: 'Marca', width: '20%' },
                      { title: 'Precio', width: '17%' },
                      { title: 'Cantidad', width: '10%' },
                      { title: 'Subtotal', width: '22%' },
                      { title: 'Acción', width: '5%' },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : null}
          {orderType === 'OS' ? (
            <div>
              <div className={styles.listContainer}>
                <span className={styles.subTitle}>Productos en orden</span>
                <div className={styles.prodToOrderContainer}>
                  <CustomTable
                    type="list-sell"
                    process="sell"
                    fnDelete={fnDelete}
                    color="teal"
                    // products={listOrder}
                    fnUpdate={fnUpdate}
                    fnPrUpdate={fnPrUpdate}
                    colum={[
                      { title: 'Artículo', width: '25%' },
                      { title: 'Marca', width: '20%' },
                      { title: 'Precio', width: '17%' },
                      { title: 'Cantidad', width: '12%' },
                      { title: 'Subtotal', width: '16%' },
                      { title: 'Acción', width: '10%' },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Drawer>
    </>
  );
};
export default CustomDrawer;
