import React, { useMemo, useState } from 'react';
import styles from './searchCurrentAcount.module.css';
import { Button, Label, Radio } from 'semantic-ui-react';
import CustomModal from '../../commonds/customModal/CustomModal';
import NewMovimientContainer from '../../containers/NewMovimentContainer';
import CustomMenu from '../customMenu/CustomMenu';
import NewNCContainer from '../../containers/NewNCContainer';
import { numberToString } from '../../utils';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import { Spinner } from 'react-bootstrap';
import { getPendingReq } from '../../request/movNoApplyRequest';
import { clientReport } from '../../templates/reporteCuentaCliente';
import ClientAcountTable from '../tables/ClientAcountTable/ClientAcountTable';
import { setFilterMovements } from '../../redux/filtersMovements';
import { useDispatch, useSelector } from 'react-redux';
import { normalizeResumeRequest } from '../../request/currentAcountRequest';
import Swal from 'sweetalert2';

function SearchCurrentAcount(props) {
  const dispatch = useDispatch();
  const acountState = useSelector((state) => state.searchMovements);

  const currentAcount = useMemo(() => {
    return acountState.data?.currentAcount;
  }, [acountState.data?.currentAcount?.resume]);

  const [printPending, setPrintPending] = useState(false);
  const [normalize, setNormalize] = useState(false);

  const filterMovements = useSelector((state) => state.filterMovementsOrder);

  const getPending = async () => {
    setPrintPending(true);
    try {
      const pending = await getPendingReq(currentAcount.id);
      // console.log(pending);
      const nuevaVentana = window.open('', '', 'width=900,height=1250');

      const items = pending.movements;
      const itemsPerPage = 14; // Número de ítems por página
      const totalPages = Math.ceil(items?.length / itemsPerPage);

      for (
        let i = 0;
        i < (items?.length > 0 ? items?.length : 1);
        i += itemsPerPage
      ) {
        const pageNumber = Math.floor(i / itemsPerPage) + 1;
        const pageItems =
          items?.length > 0 ? items?.slice(i, i + itemsPerPage) : [];

        const render = clientReport(pending, pageItems, pageNumber, totalPages);

        const containerFact = nuevaVentana.document.createElement('div');
        nuevaVentana.document.body.appendChild(containerFact);

        containerFact.innerHTML = render;
        {
          if (pageNumber < totalPages)
            nuevaVentana.document.body.appendChild(
              nuevaVentana.document.createElement('div')
            ).style.pageBreakBefore = 'always';
        }
      }
    } catch (err) {
    } finally {
      setPrintPending(false);
    }
  };

  const setResume = async () => {
    try {
      Swal.fire({
        title: 'Vas a recalcular el resumen del clinete. Estas seguro?',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          setNormalize(true);
          const result = await normalizeResumeRequest(currentAcount.id);
          setNormalize(false);
          Swal.fire('Actualizado!', '', 'success');
        }
      });
      setNormalize(false);
      return;
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${err.message}`,
      });
      setNormalize(false);
    } finally {
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <div className={styles.inputContainer}>
          <div>
            <div className={styles.dataContainer}>
              <span className={styles.spanTitle}>
                Razón Social:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.supplier
                    ? currentAcount?.supplier?.razonSocial.toUpperCase()
                    : currentAcount?.client?.razonSocial.toUpperCase()}
                </span>
              </span>
              <span className={styles.spanTitle}>
                CUIT:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.supplier
                    ? currentAcount?.supplier?.cuit
                    : currentAcount?.client?.cuit}
                </span>
              </span>
              <span className={styles.spanTitle}>
                IVA:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.supplier
                    ? 'No definido'
                    : currentAcount?.client?.iva}
                </span>
              </span>
            </div>
            <div className={styles.dataContainer}>
              <span className={styles.spanTitle}>
                Numero de cuenta:{' '}
                <span className={styles.spanContent}>
                  {currentAcount?.acountNumber}
                </span>
              </span>
              <span className={styles.spanTitle}>
                Saldo:{' '}
                <span
                  style={{
                    color: `${currentAcount?.resume < 0 ? 'red' : 'green'}`,
                    fontWeight: '700',
                  }}
                  className={`$styles.spanContent`}
                >{`$ ${numberToString(currentAcount?.resume)}`}</span>
              </span>
              <span className={styles.spanTitle}>
                Estado:{' '}
                <Label color={currentAcount?.status ? 'green' : 'red'}>
                  {currentAcount?.status ? 'Habilitada' : 'Inhabilitada'}
                </Label>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <span className={styles.subTitle}>Detalle de movimientos</span>
        <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
          <div className={styles.buttonMovContainer}>
            <div style={{ display: 'flex', position: 'relative' }}>
              <CustomModal
                title={`Registrar movimiento`}
                size="lg"
                actionButton={
                  <Button
                    disabled={
                      !acountState.data?.movements?.list?.some(
                        (mov) => mov.marc
                      )
                    }
                  >
                    Nuevo pago
                  </Button>
                }
                bodyModal={(props) => <NewMovimientContainer {...props} />}
                bodyProps={{
                  currentAcountId: currentAcount?.id,
                  acountState: acountState,
                }}
              />
              <CustomModal
                title={`Registrar nota de crédito`}
                size="lg"
                actionButton={<Button>Nueva nota de crédito</Button>}
                bodyModal={(props) => <NewNCContainer {...props} />}
                bodyProps={{
                  currentAcountId: currentAcount?.id,
                  acountState: acountState,
                  type: 'nc',
                }}
              />
              <div>
                <CustomMenu>
                  <div className={styles.radCont}>
                    <div className={styles.labTogCont}>
                      <label>Facturas</label>
                      <Radio
                        toggle
                        defaultChecked={filterMovements.facturas}
                        onChange={() => {
                          dispatch(
                            setFilterMovements({
                              name: 'facturas',
                              value: !filterMovements.facturas,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className={styles.labTogCont}>
                      <label>Pagos</label>
                      <Radio
                        toggle
                        defaultChecked={filterMovements.pagos}
                        onChange={() => {
                          dispatch(
                            setFilterMovements({
                              name: 'pagos',
                              value: !filterMovements.pagos,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className={styles.labTogCont}>
                      <label>Notas de crédito</label>
                      <Radio
                        toggle
                        defaultChecked={filterMovements.notasCredito}
                        onChange={() => {
                          dispatch(
                            setFilterMovements({
                              name: 'notasCredito',
                              value: !filterMovements.notasCredito,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className={styles.labTogCont}>
                      <label>Devoluciones</label>
                      <Radio
                        toggle
                        defaultChecked={filterMovements.devoluciones}
                        onChange={() => {
                          dispatch(
                            setFilterMovements({
                              name: 'devoluciones',
                              value: !filterMovements.devoluciones,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className={styles.labTogCont}>
                      <label>Descuentos</label>
                      <Radio
                        toggle
                        defaultChecked={filterMovements.descuentos}
                        onChange={() => {
                          dispatch(
                            setFilterMovements({
                              name: 'descuentos',
                              value: !filterMovements.descuentos,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                </CustomMenu>
              </div>
              <div
                style={{
                  marginLeft: '90px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <label>Todo</label>
                <Radio
                  toggle
                  defaultChecked={filterMovements.pending}
                  onChange={() => {
                    dispatch(
                      setFilterMovements({
                        name: 'pending',
                        value: !filterMovements.pending,
                      })
                    );
                  }}
                  style={{ margin: '0px 5px' }}
                />
                <label>Pendiente</label>
              </div>
            </div>
            <div>
              <ProtectedComponent listAccesss={[1]} >
                <Button
                  disabled={normalize}
                  type="button"
                  onClick={() => {
                    setResume();
                  }}
                >
                  {normalize ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Recalcular'
                  )}
                </Button>
              </ProtectedComponent>
              <Button
                type="button"
                onClick={() => {
                  getPending();
                }}
              >
                {printPending ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  'Imprimir pendiente'
                )}
              </Button>
            </div>
          </div>
        </ProtectedComponent>
        <div className={styles.tableCont}>
          <ClientAcountTable />
        </div>
      </div>
    </div>
  );
}

export default SearchCurrentAcount;
