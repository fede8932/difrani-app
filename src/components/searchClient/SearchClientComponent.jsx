import React from 'react';
import styles from './searchClient.module.css';
import Button from 'react-bootstrap/esm/Button';
import CustomInput from '../../commonds/input/CustomInput';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import RoleTableContainer from '../../containers/RoleTableContainer';
import CustomModal from '../../commonds/customModal/CustomModal';
import { Popup } from 'semantic-ui-react';
import BillReport from '../facturaReports/BillReport';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';

function SearchClientComponent(props) {
  const {
    methods,
    onSubmit,
    result,
    redirectEditPercents,
    resetSearch,
    changePageFn,
  } = props;
  return (
    <FormProvider {...methods}>
      <form
        className={styles.formContainer}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Campos de filtrado</span>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '70%',
                }}
              >
                <CustomInput
                  name="campo"
                  type="text"
                  width="extraMedium"
                  placeholder="Ingrese el cuit o razón social del cliente"
                  icon="fa-solid fa-magnifying-glass"
                  validate={{ required: true }}
                />
                <Button
                  type="submit"
                  style={{
                    backgroundColor: '#673ab7',
                    border: '1px solid #673ab7',
                    height: '48px',
                    width: '100px',
                    marginLeft: '10px',
                  }}
                >
                  {!result.loading ? (
                    'Buscar'
                  ) : (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}
                </Button>
                <Button
                  type="reset"
                  style={{
                    backgroundColor: 'grey',
                    border: '1px solid grey',
                    height: '47px',
                    width: '100px',
                    marginLeft: '10px',
                  }}
                  onClick={() => {
                    resetSearch();
                  }}
                >
                  Limpiar
                </Button>
              </div>
              <div>
                <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
                  <CustomModal
                    title="Descargar reporte de facturación"
                    size="lg"
                    actionButton={
                      <buton className={styles.iconB}>
                        <i className="fa-solid fa-download"></i>
                        <span style={{ marginLeft: '4px' }}>
                          Descargar facturación
                        </span>
                      </buton>
                    }
                    bodyModal={(props) => <BillReport {...props} />}
                  />
                </ProtectedComponent>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <span className={styles.subTitle}>Detalle de clientes</span>
          <RoleTableContainer
            colum={[
              { title: 'ID Cliente', width: '10%' },
              { title: 'Razon Social', width: '25%' },
              { title: 'CUIT', width: '15%' },
              { title: 'C. Corriente', width: '15%' },
              { title: 'Saldo', width: '15%' },
              { title: 'Estado', width: '10%' },
              { title: 'Acciones', width: '10%' },
            ]}
            result={result}
            redirectEditPercents={redirectEditPercents}
            changePageFn={changePageFn}
            type="client"
          />
        </div>
      </form>
    </FormProvider>
  );
}

export default SearchClientComponent;
