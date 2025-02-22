import React from 'react';
import styles from './searchBrand.module.css';
import LongTableContainer from '../../containers/LongTableContainer';
import CustomInput from '../../commonds/input/CustomInput';
import Button from 'react-bootstrap/Button';
import { FormProvider } from 'react-hook-form';
import Spinner from 'react-bootstrap/esm/Spinner';
import NativeTableContainer from '../../containers/NativeTableContainer';
import { tabBrands } from '../../utils';
import CustomModal from '../../commonds/customModal/CustomModal';
import EditBrandContainer from '../../containers/EditBrandContainer';
import AddSupplierToBrandContainer from '../../containers/AddSupplierToBrandContainer';
import ProtectedComponent from '../../protected/protectedComponent/ProtectedComponent';
import IconButonUsersTable from '../../commonds/iconButtonUsersTable/IconButonUsersTable';
import BrandsTable from '../tables/brandsTable/BrandsTable';

function SearchBrandComponent(props) {
  const { onSubmit, methods, brands, status, resetSearch, toggleEcommerce } =
    props;
  const tableColumns = [
    { title: 'Código', width: '15%', renderProp: 'code' },
    { title: 'Nombre', width: '35%', renderProp: 'name' },
    { title: 'Proveedor', width: '20%', renderProp: 'supplier' },
    { title: 'Rentabilidad', width: '15%', renderProp: 'rentabilidad' },
    { title: 'Ecommerce', width: '7%', renderProp: 'check' },
    { title: 'Acciones', width: '8%', renderProp: null },
  ];
  return (
      <div
        className={styles.formContainer}
      ><BrandsTable />
        {/* <div className={styles.subFormContainer}>
          <div className={styles.inputContainer}>
            <span className={styles.subTitle}>Campos de filtrado</span>
            <div className={styles.searchContainer}>
              <CustomInput
                name="brandCode"
                type="text"
                width="extraMedium"
                placeholder="Código de la marca"
                icon="fas fa-hashtag"
                validate={{ required: false }}
              />
              <Button
                type="submit"
                style={{
                  backgroundColor: '#673ab7',
                  border: '1px solid #673ab7',
                  height: '47px',
                  width: '100px',
                  marginLeft: '10px',
                }}
              >
                {!status ? (
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
          </div>
        </div> */}
        {/* <div className={styles.tableContainer}>
          <span className={styles.subTitle}>Detalle de marcas</span>
          <NativeTableContainer
            toggleEcommerce={toggleEcommerce}
            columns={tableColumns}
            dataRender={tabBrands(brands)}
            ckeck={{
              component: (props) => <span>hola mundo</span>,
              props: { text: 'hola mundo' },
            }}
            actions={[
              {
                component: (props) => <CustomModal {...props} />,
                props: {
                  title: 'Editar marca',
                  size: 'sm',
                  actionButton: (
                    <button
                      style={{ margin: '1px 0px 0px 7px' }}
                      className={styles.iconButton}
                      type="button"
                    >
                      <i
                        className={`fa-regular fa-pen-to-square ${styles.blueIcon} ${styles.customModalIcon}`}
                      ></i>
                    </button>
                  ),
                  bodyModal: (props) => <EditBrandContainer {...props} />,
                  bodyProps: { brands: tabBrands(brands).list },
                },
              },
              {
                component: (props) => <CustomModal {...props} />,
                props: {
                  title: 'Editar proveedores',
                  size: 'lg',
                  actionButton: (
                    <button
                      style={{ margin: '1px 0px 0px 7px' }}
                      className={styles.iconButton}
                      type="button"
                    >
                      <i
                        className={`fa-solid fa-user-plus ${styles.blueIcon} ${styles.customModalIcon}`}
                      ></i>
                    </button>
                  ),
                  bodyModal: (props) => (
                    <AddSupplierToBrandContainer {...props} />
                  ),
                  bodyProps: { brands: tabBrands(brands).list },
                },
              },
              {
                component: (props) => 
                  <ProtectedComponent listAccesss={[1, 2]}>
                    <IconButonUsersTable
                      popupText="Ofertas"
                      fn={() => {
                        navigate(`/equivalences/${data.id}`);
                      }}
                      icon="fa-solid fa-scale-balanced"
                      iconInitialStyle="iconStyleBlue"
                    />
                  </ProtectedComponent>,
                props: {
                  title: 'Editar proveedores',
                  size: 'lg',
                  actionButton: (
                    <button
                      style={{ margin: '1px 0px 0px 7px' }}
                      className={styles.iconButton}
                      type="button"
                    >
                      <i
                        className={`fa-solid fa-user-plus ${styles.blueIcon} ${styles.customModalIcon}`}
                      ></i>
                    </button>
                  ),
                  bodyModal: (props) => (
                    <AddSupplierToBrandContainer {...props} />
                  ),
                  bodyProps: { brands: tabBrands(brands).list },
                },
              },
            ]}
          />
        </div> */}
      </div>
  );
}

export default SearchBrandComponent;
