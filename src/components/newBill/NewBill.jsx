import React, { useState } from 'react';
import styles from './newBill.module.css';
import { dateConverter, redondearADosDecimales } from '../../utils';
import CustomTable from '../../commonds/table/CustomTable';
import { Button, Spinner } from 'react-bootstrap';

function NewBill(props) {
  const {
    client,
    order,
    onSubmit,
    listOrder,
    addItemToBill,
    totalFac,
    totalNoFac,
    loading,
  } = props;
  return (
    <div className={styles.facContainer}>
      <div className={styles.dataContainer}>
        <span style={{ width: '33%' }}>
          Fecha:{' '}
          <span className={styles.datosSpan}>{dateConverter(new Date())}</span>
        </span>
        <span
          style={{ width: '33%', display: 'flex', justifyContent: 'center' }}
        >
          CUIT: <span className={styles.datosSpan}>{client.cuit}</span>
        </span>
        <span style={{ width: '33%', display: 'flex', justifyContent: 'end' }}>
          Razon Social:{' '}
          <span className={styles.datosSpan}>{client.razonSocial}</span>
        </span>
      </div>
      <div className={styles.dataContainer}>
        <span style={{ width: '33%' }}>
          Orden: <span className={styles.datosSpan}>{order.numero}</span>
        </span>
        <span
          style={{ width: '33%', display: 'flex', justifyContent: 'center' }}
        >
          Subtotal:{' '}
          <span className={styles.datosSpan}>{`$ ${order.subTotal}`}</span>
        </span>
        <span style={{ width: '33%', display: 'flex', justifyContent: 'end' }}>
          Total: <span className={styles.datosSpan}>{`$ ${order.total}`}</span>
        </span>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.message}>
          Seleccioná aquellos items que deben incluirse en la factura oficial
        </div>
      </div>
      <div className={styles.tableContainer}>
        <CustomTable
          type="fact"
          color="teal"
          products={listOrder}
          addItemToBill={addItemToBill}
          colum={[
            { title: 'Artículo', width: '20%' },
            { title: 'Marca', width: '22%' },
            { title: 'Cantidad', width: '10%' },
            { title: 'Precio Uni', width: '22%' },
            { title: 'IVA', width: '16%' },
            { title: 'Facturar', width: '10%' },
          ]}
        />
      </div>
      <div className={styles.buttonContainer}>
        <div>
          <div>
            <span>
              Total Facturado:
              <span className={styles.datosSpan}>{`$ ${redondearADosDecimales(
                totalFac
              )}`}</span>
            </span>
          </div>
          <div>
            <span>
              Total Presupuesto:
              <span className={styles.datosSpan}>{`$ ${redondearADosDecimales(
                totalNoFac
              )}`}</span>
            </span>
          </div>
        </div>
        <Button
          onClick={() => {
            onSubmit();
          }}
          style={{
            backgroundColor: '#673ab7',
            border: '1px solid #673ab7',
            height: '35px',
            width: '100px',
            marginLeft: '10px',
          }}
        >
          {loading ? <Spinner size="sm" /> : 'Confirmar'}
        </Button>
      </div>
    </div>
  );
}

export default NewBill;
