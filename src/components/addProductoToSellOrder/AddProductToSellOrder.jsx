import React, { useState } from 'react';
import styles from './addProduct.module.css';
import Button from 'react-bootstrap/esm/Button';
import { FormProvider } from 'react-hook-form';
import CustomDrawer from '../../commonds/drawer/CustomDrawer';
import { useSelector } from 'react-redux';
import CustomModal from '../../commonds/customModal/CustomModal';
import NewBillContainer from '../../containers/NewBillContainer';
import { numberToString } from '../../utils';
import { orderStatus } from '../../enum/StatusOrderEnum';
import AddProductsTable from '../tables/addProductsTable/AddProductsTable';

function AddProductToSellOrder(props) {
  const {
    nextFn,
    methods,
    onSubmit,
    fnDelete,
    fnUpdate,
    fnPrUpdate,
    fnAdd,
    /*listOrder,*/
    order,
    cancel,
    type,
    confirmFn,
  } = props;

  const customerDiscounts = useSelector((state) => state.client)?.data
    ?.customerDiscounts; // Se usa para renderizar el precio cuando es una venta

  const client = useSelector((state) => state.client);
  const listOrder = useSelector((state) => state.listOrderItems).data;
  // console.log(client);
  return (
    <div>
      <div className={styles.addProdSubContainer}>
        <div className={styles.resumenContainer}>
          <div className={styles.prodToOrderContainer}>
            <div className={styles.infoProvContainer}>
              <span className={styles.labelInfoProv}>
                <i class="fa-solid fa-file-invoice"></i> IVA:
                <span className={styles.textInfoProv}>-</span>
              </span>
              <span className={styles.labelInfoProv}>
                <i class="fa-solid fa-dumpster"></i> Punto de venta:
                <span className={styles.textInfoProv}>Blase</span>
              </span>
              <span className={styles.labelInfoProv}>
                <i class="fa-solid fa-hashtag"></i> Nº de presupuesto:
                <span className={styles.textInfoProv}>{order.data.numero}</span>
              </span>
              <span className={styles.textInfoProv}>
                <i class="fa-solid fa-money-bill"></i> Subtotal:
                <span className={styles.textInfoProv}>{`$ ${numberToString(
                  order.data.subTotal
                )}`}</span>
              </span>
              <span className={styles.textInfoProv}>
                <i class="fa-solid fa-money-bill-1-wave"></i> Total:
                <span className={styles.precioText}>{`$ ${numberToString(
                  order.data.subTotal * 1.21
                )}`}</span>
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '30px',
                }}
              >
                <div className={styles[client?.data?.inTerm]}></div>
                <span>
                  {client?.data?.inTerm == 'Green'
                    ? 'En término'
                    : client?.data?.inTerm == 'Blue'
                      ? 'Pago pendiente'
                      : client?.data?.inTerm == 'Orange'
                        ? 'Pago atrasado'
                        : 'Bloqueado'}
                </span>
              </div>
              <CustomDrawer
                type={'type'}
                orderType="OS"
                fnDelete={fnDelete}
                fnUpdate={fnUpdate}
                fnPrUpdate={fnPrUpdate}
                listOrder={listOrder}
                orderAjust={'orderAjust'}
              />
            </div>
          </div>
          <div className={styles.searchTableContainer}>
            <AddProductsTable
              customerDiscounts={customerDiscounts}
              fnAdd={fnAdd}
            />
            {/* <div className={styles.tableProdContainer}>
                  <CustomTable
                    equivalenceId={equivalenceId}
                    setEquivalenceId={setEquivalenceId}
                    type="search-sell"
                    process="sell"
                    color="blue"
                    products={productPages.data.list}
                    customerDiscounts={customerDiscounts}
                    fnAdd={fnAdd}
                    fnInfo={fnInfo}
                    colum={[
                      { title: 'Artículo', width: '8%' },
                      { title: 'Descripción', width: '42%' },
                      { title: 'Marca', width: '16%' },
                      { title: 'Precio', width: '10%' },
                      { title: 'Precio c/IVA', width: '10%' },
                      { title: 'Stock', width: '3%' },
                      { title: 'Acción', width: '7%' },
                    ]}
                  />
                </div> */}
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.comentarios}>
          <span>{client?.data?.comentarios?.toUpperCase()}</span>
        </div>
        <div className={styles.buttonCondContainer}>
          {orderStatus[order.data.status] != 'Confirm' ? (
            <Button
              className={`${styles.buttonStyle} ${styles.buttonStyleBack}`}
              variant="danger"
              onClick={() => {
                cancel(order.data.id);
              }}
            >
              Cancelar
            </Button>
          ) : null}
          {type == 'sale' ? (
            <div>
              {orderStatus[order.data.status] != 'Confirm' ? (
                <Button
                  disabled={order.data.subTotal < 1}
                  className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
                  variant="primary"
                  onClick={() => {
                    confirmFn(order.data.id, 'Confirm');
                  }}
                >
                  Confirmar
                </Button>
              ) : (
                <CustomModal
                  title="Facturación"
                  size="lg"
                  actionButton={
                    <Button
                      disabled={
                        order.data.subTotal < 1 ||
                        order.data.pickingOrder.status == 0
                      }
                    >
                      Facturar
                    </Button>
                  }
                  actionProps={{
                    className: `${styles.buttonStyle} ${styles.buttonStyleNext}`,
                    variant: 'primary',
                  }}
                  bodyModal={(props) => <NewBillContainer {...props} />}
                />
              )}
            </div>
          ) : (
            <Button
              className={`${styles.buttonStyle} ${styles.buttonStyleNext}`}
              variant="primary"
              onClick={() => {
                nextFn(1);
              }}
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProductToSellOrder;
