import React from 'react';
import styles from './paymentDiscount.module.css';
import {
  Button,
  Checkbox,
  Dropdown,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import CustomTextArea from '../../commonds/textarea/CustomTextArea';

const paymentMethodOptions = [
  { key: 'cash', text: 'Efectivo', value: 'Cash' },
  { key: 'transfer', text: 'Transferencia', value: 'Transfer' },
  { key: 'card', text: 'Tarjeta', value: 'Card' },
  { key: 'cheque', text: 'Cheque', value: 'Cheque' },
];

function PaymentDiscountComponent(props) {
  const {
    methods,
    newDiscount,
    deleteDiscount,
    toggleDiscount,
    loading,
    discounts,
  } = props;

  return (
    <div>
      <div className={styles.addUserContainer}>
        <div className={styles.leftCont}>
          <FormProvider {...methods}>
            <h4 style={{ marginTop: '5px' }}>
              Ingresá un nuevo descuento por medio de pago
            </h4>
            <form>
              <label>Medio de pago</label>
              <Dropdown
                placeholder="Seleccioná un medio de pago"
                fluid
                selection
                options={paymentMethodOptions}
                onChange={(_, data) => methods.setValue('paymentMethod', data.value)}
                style={{ zIndex: 1000 }}
              />
              <label>Porcentaje</label>
              <CustomInput
                name="percentage"
                type="text"
                width="medium"
                placeholder="Ingresá el porcentaje de descuento"
                icon="fa-solid fa-percent"
                validate={{
                  required: true,
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Debe ser un número positivo',
                  },
                }}
              />
              <label>Observaciones</label>
              <CustomTextArea
                name="notes"
                width="medium"
                placeholder="En este campo podes ingresar observaciones... (Máximo 250 caracteres)"
                type="textarea"
                validate={{ required: false, maxLength: 250 }}
              />
              <div style={{ marginBottom: '10px' }}>
                <Button
                  onClick={methods.handleSubmit(newDiscount)}
                  primary
                  loading={loading}
                  className={styles.button}
                >
                  Nuevo descuento
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className={styles.rigthCont}>
          <div className={styles.tableOneContainer}>
            <Table celled compact>
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableHeaderCell width={5}>Medio de pago</TableHeaderCell>
                  <TableHeaderCell width={3}>Porcentaje</TableHeaderCell>
                  <TableHeaderCell width={2}>Activo</TableHeaderCell>
                  <TableHeaderCell width={2}>Acciones</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {discounts?.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell>{d.paymentMethod}</TableCell>
                    <TableCell>{(d.percentage * 100).toFixed(2)}%</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={d.active}
                        onChange={() => toggleDiscount(d.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        icon="trash"
                        color="red"
                        size="tiny"
                        onClick={() => deleteDiscount(d.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDiscountComponent;
