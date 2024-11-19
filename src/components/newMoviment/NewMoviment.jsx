import React, { useState } from 'react';
import styles from './newMoviment.module.css';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import { default as EditInput } from '../../commonds/putInput/CustomInput';
import CustomSelect from '../../commonds/select/CustomSelect';
import Button from 'react-bootstrap/esm/Button';
import {
  compareNCListFactList,
  filterOrders,
  redondearADosDecimales,
} from '../../utils';
import { Checkbox } from 'semantic-ui-react';
import RoleTableContainer from '../../containers/RoleTableContainer';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { DatePicker } from 'antd';

function NewMoviment(props) {
  const {
    methods,
    method,
    setMethod,
    onSubmit,
    selectState,
    setSelectState,
    listMov,
    checked,
    setChecked,
    listNcNoApply,
    marcToggle,
    maxPay,
    cancelFactFn,
    inactive,
  } = props;
  // console.log(listMov);
  // console.log(itemList);
  const loading = useSelector((state) => state.searchOrders).loading;
  const [applyNc, setApplyNc] = useState(false);
  const [movType, setMovType] = useState(1);
  const handleMovSelect = (e) => {
    setMovType(e);
    if (e == 2) {
      setApplyNc(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.infoContainer}>
        <i class="fa-regular fa-folder-open"></i>
        <span style={{ marginLeft: '5px' }}>Facturas afectadas:</span>
        <div style={{ display: 'inline-block' }}>
          {listMov.map((m, i) => (
            <span className={styles.label} key={i}>
              {m.numComprobante}
            </span>
          ))}
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <i class="fa-solid fa-file-invoice"></i>
            <span style={{ marginLeft: '5px' }}>
              Saldo pendiente: $
              {/* {redondearADosDecimales(
                checked
                  ? listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0) *
                      (1 - 0.06)
                  : listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0)
              )} */}
            </span>
          </div>
        </div>
      </div>
      <FormProvider {...methods} className={styles.provider}>
        <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
          <span>Tipo de movimiento</span>
          <CustomSelect
            text="Seleccionar tipo de movimiento"
            name="mov"
            validate={{ required: true }}
            arrayOptions={[
              { value: 1, text: 'Pago' },
              { value: 2, text: 'Cancelación' },
            ]}
            fnSelect={handleMovSelect}
          />
          {movType == 1 ? (
            <>
              <span>Medio de pago</span>
              <CustomSelect
                defaultValue={2}
                text="Selecccionar el método de pago"
                name="method"
                validate={{ required: true }}
                arrayOptions={[
                  { value: 1, text: 'Cheque' },
                  { value: 2, text: 'Efectivo' },
                  { value: 3, text: 'Transferencia' },
                ]}
                fnSelect={(e) => {
                  console.log(e);
                  let newMethod = { ...method };
                  // console.log(newMethod);
                  newMethod.method = Number(e);
                  setMethod(newMethod);
                }}
              />
              <div className={styles.divInputCont2}>
                {/* <DatePicker
                  placeholder="Fecha de ingreso"
                  className={styles.pickStyle}
                  onChange={(date) => {
                    if (date) {
                      let newMethod = { ...method };
                      newMethod.fecha = date.toISOString(); // Convierte la fecha al formato ISO
                      setMethod(newMethod);
                    }
                  }}
                  getPopupContainer={(trigger) => trigger.parentNode}
                /> */}
                <CustomInput
                  name="comprobanteVendedor"
                  type="text"
                  width="xsmall"
                  placeholder="Ingrese el comprobante de vendedor"
                  icon="fa-solid fa-arrow-up-9-1"
                  validate={{ required: true }}
                />
              </div>
              {method.method == 3 || method.method == 1 ? (
                <div className={styles.divInputCont2}>
                  {method.method == 3 ? (
                    <CustomInput
                      name="numOperation"
                      type="text"
                      width="small"
                      placeholder="Ingrese el número de operación"
                      icon="fa-solid fa-arrow-down-up-across-line"
                      validate={{ required: true }}
                    />
                  ) : null}
                  <CustomInput
                    name="banco"
                    type="text"
                    width={method.method == 3 ? 'xsmall' : 'small'}
                    placeholder="Ingrese el nombre del banco"
                    icon="fa-solid fa-building-columns"
                    validate={{ required: true }}
                  />
                </div>
              ) : null}
              {method.method == 1 ? (
                <div className={styles.divInputCont2}>
                  <DatePicker
                    placeholder="Fecha de cobro"
                    className={styles.pickStyle}
                    onChange={(date) => {
                      if (date) {
                        let newMethod = { ...method };
                        newMethod.fechaCobro = date.toISOString(); // Convierte la fecha al formato ISO
                        setMethod(newMethod);
                      }
                    }}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  />
                  <CustomInput
                    name="numCheque"
                    type="text"
                    width="xsmall"
                    placeholder="Ingrese el número de cheque"
                    icon="fa-solid fa-money-check"
                    validate={{ required: true }}
                  />
                </div>
              ) : null}
              <Checkbox
                style={{ marginBottom: '10px' }}
                label="Aplicar nota de crédito"
                onClick={() => setApplyNc(!applyNc)}
                checked={applyNc}
              />
              <br />
            </>
          ) : null}
          {applyNc ? (
            <div className={styles.ncTableCont}>
              <RoleTableContainer
                colum={[
                  { title: 'Marcar', width: '20%' },
                  { title: 'Fecha', width: '25%' },
                  { title: 'Comprobante', width: '30%' },
                  { title: 'Monto', width: '25%' },
                ]}
                marcToggle={marcToggle}
                result={listNcNoApply.data}
                type="noApply"
                checked={checked}
                omitPaginator={true}
              />
            </div>
          ) : null}
          {movType == 1 ? (
            <>
              <span>{`Monto del movimiento *Máx $${redondearADosDecimales(
                checked
                  ? (listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0) -
                      listNcNoApply.montoTotal) *
                      (1 - 0.06)
                  : listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0) -
                      listNcNoApply.montoTotal
              )}`}</span>
              <EditInput
                defaultValue={
                  checked
                    ? listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0) *
                      (1 - 0.06)
                    : listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0)
                }
                name="importe"
                type="text"
                width="complete"
                placeholder={`Ingrese el monto ${
                  selectState == 'nc' ? 'sin iva ' : ''
                }del movimiento`}
                icon="fa-solid fa-hand-holding-dollar"
                validate={{ required: true }}
              />
            </>
          ) : null}
          <div className={styles.buttonContainer}>
            {movType == 1 ? (
              <Checkbox
                label="Aplicar descuento del 6% por pago en término"
                onClick={() => setChecked(!checked)}
                checked={checked}
              />
            ) : (
              <div></div>
            )}
            {movType == 1 ? (
              <Button
                disabled={
                  inactive ||
                  filterOrders(listMov)?.reduce(
                    (acum, order) => acum + order.outstandingBalance,
                    0
                  ) < 1 ||
                  filterOrders(listMov)?.reduce(
                    (acum, order) => acum + order.outstandingBalance,
                    0
                  ) -
                    listNcNoApply.montoTotal <
                    0
                }
                type="submit"
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '48px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {inactive ? <Spinner /> : 'Confirmar'}
              </Button>
            ) : (
              <Button
                disabled={
                  inactive || compareNCListFactList(listMov, listNcNoApply.data)
                }
                onClick={cancelFactFn}
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '48px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {inactive ? <Spinner /> : 'Confirmar'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
export default NewMoviment;
