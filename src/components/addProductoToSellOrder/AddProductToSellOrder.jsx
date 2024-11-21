import React, { useState } from 'react';
import styles from './addProduct.module.css';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import CustomInput from '../../commonds/input/CustomInput';
import CustomTable from '../../commonds/table/CustomTable';
import { FormProvider } from 'react-hook-form';
import CustomDrawer from '../../commonds/drawer/CustomDrawer';
import PresupPDF from '../../commonds/presupuestoPDF/PresupPDF';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import CustomModal from '../../commonds/customModal/CustomModal';
import NewBillContainer from '../../containers/NewBillContainer';
import CustomPagination from '../../commonds/pagination/CustomPagination';
import { numberToString } from '../../utils';

function AddProductToSellOrder(props) {
  const {
    nextFn,
    methods,
    onSubmit,
    productPages,
    fnAdd,
    fnInfo,
    fnDelete,
    fnUpdate,
    fnPrUpdate,
    /*listOrder,*/
    order,
    cancel,
    type,
    confirmFn,
    changeFn,
    setEquivalenceId,
    equivalenceId,
  } = props;

  const customerDiscounts = useSelector((state) => state.client).data
    .customerDiscounts; // Se usa para renderizar el precio cuando es una venta

  const client = useSelector((state) => state.client);
  // console.log(client);
  return (
    <FormProvider {...methods}>
      <form
        className={styles.addProductContainer}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className={styles.addProdSubContainer}>
          <div className={styles.resumenContainer}>
            <div className={styles.prodToOrderContainer}>
              <div className={styles.infoProvContainer}>
                <span className={styles.labelInfoProv}>
                  <i class="fa-solid fa-file-invoice"></i> IVA:
                  <span className={styles.textInfoProv}>Final</span>
                </span>
                <span className={styles.labelInfoProv}>
                  <i class="fa-solid fa-dumpster"></i> Punto de venta:
                  <span className={styles.textInfoProv}>Blase</span>
                </span>
                <span className={styles.labelInfoProv}>
                  <i class="fa-solid fa-hashtag"></i> Nº de presupuesto:
                  <span className={styles.textInfoProv}>
                    {order.data.numero}
                  </span>
                </span>
                <span className={styles.textInfoProv}>
                  <i class="fa-solid fa-money-bill"></i> Subtotal:
                  <span className={styles.textInfoProv}>{`$ ${numberToString(
                    order.data.subTotal
                  )}`}</span>
                </span>
                <span className={styles.textInfoProv}>
                  <i class="fa-solid fa-money-bill-trend-up"></i> IVA:
                  <span className={styles.textInfoProv}>{`$ ${numberToString(
                    order.data.subTotal * 0.21
                  )}`}</span>
                </span>
                <span className={styles.textInfoProv}>
                  <i class="fa-solid fa-money-bill-1-wave"></i> Total:
                  <span className={styles.precioText}>{`$ ${numberToString(
                    order.data.subTotal * 1.21
                  )}`}</span>
                </span>
              </div>
            </div>
            <div className={styles.searchContainer}>
              <span className={styles.subTitle}>Buscador de productos</span>
              <div className={styles.searchTableContainer}>
                <div className={styles.buttonSearchCotainer}>
                  <div className={styles.inputSearchContainer}>
                    <CustomInput
                      name="dataSearch"
                      type="text"
                      width="small"
                      placeholder="Artículo"
                      icon="fa-solid fa-magnifying-glass"
                      validate={{ required: true }}
                    />
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: '#673ab7',
                        border: '1px solid #673ab7',
                        height: '47px',
                        marginLeft: '20px',
                        width: '100px',
                      }}
                    >
                      {!productPages.loading ? (
                        'Buscar'
                      ) : (
                        <Spinner animation="border" variant="light" size="sm" />
                      )}
                    </Button>
                  </div>
                  <div className={styles.comentarios}>
                    <span>{client?.data?.comentarios}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '30px',
                    }}
                  >
                    <div className={styles[client.data.inTerm]}></div>
                    <span>
                      {console.log(client.data.inTerm)}
                      {client.data.inTerm == 'Green'
                        ? 'En término'
                        : client.data.inTerm == 'Blue'
                          ? 'Pago pendiente'
                          : client.data.inTerm == 'Orange'
                            ? 'Pago atrasado'
                            : 'Bloqueado'}
                    </span>
                  </div>
                  <div className={styles.buttonInfoContainer}>
                    <CustomDrawer
                      type={'type'}
                      orderType="OS"
                      fnDelete={fnDelete}
                      fnUpdate={fnUpdate}
                      fnPrUpdate={fnPrUpdate}
                      // listOrder={listOrder}
                      orderAjust={'orderAjust'}
                    />
                  </div>
                </div>
                <div className={styles.tableProdContainer}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <CustomPagination
            pages={productPages.data.totalPages}
            changeFn={changeFn}
            initPage={1}
          />
          <div className={styles.buttonCondContainer}>
            {order.data.status != 'Confirm' ? (
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
                {order.data.status != 'Confirm' ? (
                  <Button
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
      </form>
    </FormProvider>
  );
}

export default AddProductToSellOrder;
