import React, { useState, useEffect } from 'react';
import styles from './productsale.module.css';
import {
  Button,
  Checkbox,
  Popup,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { FormProvider } from 'react-hook-form';
import CustomInput from '../../commonds/input/CustomInput';
import CustomTextArea from '../../commonds/textarea/CustomTextArea';
import IconButonUsersTable from '../../commonds/iconButtonUsersTable/IconButonUsersTable';

function ProductSaleComponent(props) {
  const { methods, newSale, deleterSale, toogleStatusSale, changePriori } =
    props;
  const { data, loading } = useSelector((state) => state.selectProduct);
  // console.log(data);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          backgroundColor: '#DFE4E8',
        }}
      >
        <span>
          <i className="fa-solid fa-barcode"></i>
          <span className={styles.selectArticle}>{data?.article}</span>
        </span>
        <span>
          <i className="fa-solid fa-magnifying-glass-chart"></i>
          <span className={styles.selectArticle}>{data?.description}</span>
        </span>
      </div>
      <div className={styles.addUserContainer}>
        <div className={styles.leftCont}>
          <FormProvider {...methods}>
            <h4 style={{ marginTop: '5px' }}>
              Ingresá una nueva oferta desde el formulario
            </h4>
            <form>
              <label>Referencia</label>
              <CustomInput
                name="name"
                type="text"
                width="medium"
                placeholder="Ingresá una referencia"
                icon="fa-regular fa-bookmark"
                validate={{ required: true }}
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
              <label>Mínimo de compra</label>
              <CustomInput
                name="minUnit"
                width="medium"
                placeholder="Ingresá el mínimo para acceder al descuento"
                icon="fa-solid fa-cart-flatbed-suitcase"
                validate={{
                  required: true,
                  pattern: {
                    value: /^[1-9]\d*$/,
                    message: 'Debe ser un número entero positivo',
                  },
                }}
              />
              <label>Observaciones</label>
              <CustomTextArea
                name="observations"
                width="medium"
                placeholder="En este campo podes ingresar observaciones... (Máximo 250 caracteres)"
                type="textarea"
                validate={{ required: false, maxLength: 250 }}
              />
              <div style={{ marginBottom: '10px' }}>
                <Button
                  onClick={methods.handleSubmit(newSale)}
                  primary
                  loading={loading}
                  className={styles.button}
                >
                  Nueva oferta
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
                  <TableHeaderCell width={5}>Referencia</TableHeaderCell>
                  <TableHeaderCell width={3}>Porcentaje</TableHeaderCell>
                  <TableHeaderCell width={2}>Mínimo</TableHeaderCell>
                  <TableHeaderCell width={2}>Activo</TableHeaderCell>
                  <TableHeaderCell width={2}>Aciones</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.sales.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Popup
                        content={s.observations}
                        trigger={<span>{s.referencia}</span>}
                      />
                    </TableCell>
                    <TableCell>{s.percentage * 100}%</TableCell>
                    <TableCell>{s.minUnit}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={s.status}
                        onChange={() => toogleStatusSale(s.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          width: '75%',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <IconButonUsersTable
                          popupText="Eliminar"
                          fn={() => {
                            deleterSale(s.id);
                          }}
                          icon={'fa-solid fa-xmark'}
                          iconInitialStyle={'iconStyleRedSale'}
                        />
                        <IconButonUsersTable
                          disabled={i === 0}
                          popupText="Subir prioridad"
                          fn={() => {
                            changePriori(s.id, 0);
                          }}
                          icon={'fa-solid fa-circle-arrow-up'}
                          iconInitialStyle={
                            i !== 0 ? 'iconStyleGreenSale' : 'iconStyleGreySale'
                          }
                        />
                        <IconButonUsersTable
                          popupText="Bajar prioridad"
                          disabled={i === data.sales.length - 1}
                          fn={() => {
                            changePriori(s.id, 1);
                          }}
                          icon={'fa-solid fa-circle-arrow-down'}
                          iconInitialStyle={
                            i !== data.sales.length - 1
                              ? 'iconStyleRedSale'
                              : 'iconStyleGreySale'
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* <div className={styles.paginationCont}>
            <Pagination
              boundaryRange={0}
              activePage={page}
              onPageChange={handlePageChange}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              totalPages={equivalences?.products.totalPages}
            />
          </div> */}
        </div>
        {/* <div className={styles.rigthCont}>
          <div className={styles.equivContainer}>
            <Table celled compact>
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableHeaderCell width={9}>Description</TableHeaderCell>
                  <TableHeaderCell width={1}>Actions</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equivalences?.equivalence ? (
                  <TableRow>
                    <TableCell style={{ fontSize: '9px' }}>
                      {equivalences?.equivalence?.description}
                    </TableCell>
                    <TableCell>
                      <i
                        onClick={() => {
                          editFn(equivalences?.equivalence?.id);
                        }}
                        className={`${styles.editIcon} fa-regular fa-pen-to-square`}
                      ></i>
                      <i
                        onClick={() => {
                          deleteFn(equivalences?.equivalence?.id);
                        }}
                        className={`${styles.deleteIcon} fa-regular fa-trash-can`}
                      ></i>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <div className={styles.prodEquivCont}>
            <Table celled compact>
              <TableHeader
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableHeaderCell width={2}>Articulo</TableHeaderCell>
                  <TableHeaderCell width={8}>Descripción</TableHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {equivalences?.equivalencesProducts?.map((ep, i) => (
                  <TableRow key={i}>
                    <TableCell
                      style={ep.new ? { backgroundColor: '#A5FFD5' } : {}}
                    >
                      {ep.article}
                    </TableCell>
                    <TableCell
                      style={
                        ep.new
                          ? { backgroundColor: '#A5FFD5', fontSize: '9px' }
                          : { fontSize: '9px' }
                      }
                    >
                      {ep.description.slice(0, 45)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ProductSaleComponent;
