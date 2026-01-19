import React from 'react';
import styles from './billModalView.module.css';
import { useSelector } from 'react-redux';
import { getBillType } from '../../utils';
import { MovTypeEnum } from '../../enum/MovEnum';
import BillDetailTable from '../../commonds/billDetailTable/BillDetailTable';

function BillModalViewComponent(props) {
  const { data } = useSelector((state) => state.selectBill);
  let sendDate = { ...data };
  
  // For budgets (type 0, billType 0), use fItems
  // For credit notes (type 1, 3), use ncOrderItems  
  // For regular invoices (type 0, billType A/B/C), use fItems
  sendDate.purchaseOrderItems = 
    (data.type == 1 || data.type == 3) ? data.ncOrderItems : data.fItems;
  
  // If items are empty but we have purchaseOrder data, try to get items from purchaseOrder
  if (!sendDate.purchaseOrderItems || sendDate.purchaseOrderItems.length === 0) {
    if (data.purchaseOrder && data.purchaseOrder.purchaseOrderItems) {
      sendDate.purchaseOrderItems = data.purchaseOrder.purchaseOrderItems.filter(item => !item.fact);
    }
  }
  
  // For discount credit notes with no items, create a virtual item with concept
  const isDiscountNC = (data.type == 1 || data.type == 3) && 
                       (!sendDate.purchaseOrderItems || sendDate.purchaseOrderItems.length === 0);
  
  if (isDiscountNC && data.concept) {
    sendDate.purchaseOrderItems = [{
      product: {
        article: 'DESCUENTO',
        description: data.concept,
        brand: { name: 'N/A' }
      },
      amount: 1,
      sellPrice: data.total || 0,
      fact: false
    }];
  }
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span className={styles.inputLabel}>
          Tipo de comprobante:
          <span className={styles.dataUser}>
            {getBillType(MovTypeEnum[data?.type], data?.billType)}
          </span>
        </span>
        <span>
          Número de comprobante:
          <span className={styles.dataUser}>{data?.numComprobante || 'N/A'}</span>
        </span>
        <span>
          Total:<span className={styles.dataUser}>${data?.total || 0}</span>
        </span>
        <span>
          Pendiente:
          <span className={styles.dataUser}>${data?.saldoPend || 0}</span>
        </span>
        {isDiscountNC && (
          <>
            <span className={styles.inputLabel}>
              Concepto:
              <span className={styles.dataUser}>{data?.concept || 'Descuento aplicado'}</span>
            </span>
            {data?.bills && data.bills.length > 0 && (
              <span className={styles.inputLabel}>
                Factura asociada:
                <span className={styles.dataUser}>
                  {data.bills.map(bill => bill.numComprobante).join(', ') || 'N/A'}
                </span>
              </span>
            )}
          </>
        )}
      </div>
      <div className={styles.tableContainer}>
        <BillDetailTable
          columns={[
            { title: 'Código', width: '10%' },
            { title: 'Descripción', width: '50%' },
            { title: 'Marca', width: '10%' },
            { title: 'Precio', width: '10%' },
            { title: 'Cantidad', width: '10%' },
            { title: 'Total', width: '10%' },
          ]}
          color="teal"
          data={sendDate}
        />
      </div>
    </div>
  );
}

export default BillModalViewComponent;
