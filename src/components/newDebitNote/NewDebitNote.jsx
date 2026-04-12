import React from 'react';
import styles from './newDebitNote.module.css';
import { FormProvider } from 'react-hook-form';
import Button from 'react-bootstrap/esm/Button';
import { Spinner } from 'react-bootstrap';
import CustomInput from '../../commonds/input/CustomInput';
import { redondearADosDecimales } from '../../utils';

function NewDebitNote(props) {
  const { methods, onSubmit, loading, importe, iva } = props;

  const importeNum = parseFloat(String(importe || 0).replace(',', '.')) || 0;
  const ivaNum = parseFloat(String(iva || 0).replace(',', '.')) || 0;
  const total = redondearADosDecimales(importeNum + ivaNum);

  return (
    <div className={styles.formContainer}>
      <FormProvider {...methods} className={styles.provider}>
        <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>Descripción</span>
            <textarea
              className={styles.textarea}
              placeholder="Ingrese la descripción de la nota de débito (ej: Cheque rechazado - Banco Nación)"
              {...methods.register('descripcion', { required: 'La descripción es obligatoria' })}
            />
            {methods.formState.errors.descripcion && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {methods.formState.errors.descripcion.message}
              </span>
            )}
          </div>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>Importe (sin IVA)</span>
            <CustomInput
              name="importe"
              type="text"
              width="complete"
              placeholder="Ingrese el importe sin IVA"
              icon="fa-solid fa-dollar-sign"
              validate={{ required: 'El importe es obligatorio' }}
            />
          </div>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>IVA</span>
            <CustomInput
              name="iva"
              type="text"
              width="complete"
              placeholder="Ingrese el IVA (0 si no aplica)"
              icon="fa-solid fa-percent"
              validate={{}}
            />
          </div>
          <div className={styles.totalContainer}>
            <span className={styles.totalText}>
              Total: ${total}
            </span>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              disabled={loading}
              type="submit"
              style={{
                backgroundColor: '#dc3545',
                border: '1px solid #dc3545',
                height: '48px',
                width: '160px',
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Crear nota de débito'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default NewDebitNote;
