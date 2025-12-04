import React from 'react';
import styles from './addProduct.module.css';
import { FormProvider } from 'react-hook-form';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import ExcelUpload from '../../commonds/upload/ExcelUpload';
import { Checkbox } from 'semantic-ui-react';
import { downloadProductTemplate } from '../../request/productRequest';

function AddProductsFormComponent(props) {
  const {
    onSubmit,
    status,
    methods,
    setSelectedFile,
    selectedFile,
    checks,
    setChecks,
  } = props;

  const handleDownloadTemplate = async () => {
    try {
      await downloadProductTemplate();
    } catch (error) {
      console.error('Error al descargar la plantilla:', error);
    }
  };

  const changeCheck = (e, d) => {
    let newChecks = { ...checks };
    newChecks[d.name] = d.checked;
    for (let key in newChecks) {
      if (newChecks.hasOwnProperty(key) && newChecks[key] === true) {
        setChecks(newChecks);
        return;
      }
    }
  };
  // console.log(selectedFile);
  return (
    <FormProvider {...methods}>
      <div className={styles.checkContainer}>
        <Checkbox
          label="Precio"
          name="price"
          checked={checks.price}
          onClick={changeCheck}
        />
        <Checkbox
          label="Descripción"
          name="description"
          checked={checks.description}
          onClick={changeCheck}
        />
        <Checkbox
          label="Ubicación"
          name="location"
          checked={checks.location}
          onClick={changeCheck}
        />
        <Checkbox
          label="Stock"
          name="stock"
          checked={checks.stock}
          onClick={changeCheck}
        />
        <Checkbox
          label="Stock mínimo"
          name="minStock"
          checked={checks.minStock}
          onClick={changeCheck}
        />
        <Checkbox
          label="Stock máximo"
          name="maxStock"
          checked={checks.maxStock}
          onClick={changeCheck}
        />
      </div>
      <form className={styles.formContainer}>
        <div className={styles.subFormContainer}>
          <div className={styles.infoInputContainer}></div>
          <div className={styles.subUploadContainer} style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: '0', 
              right: '0', 
              zIndex: 1 
            }}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleDownloadTemplate}
                style={{
                  merginTop: '10px',
                  fontSize: '12px',
                  padding: '4px 8px',
                  border: '1px solid #dee2e6',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                }}
                title="Descargar plantilla"
              >
                Plantilla
              </Button>
            </div>
            <span className={styles.subTitle}>Subir productos</span>
            <div className={styles.uploadContainer}>
              <ExcelUpload
                label={true}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </div>
          </div>
        </div>
        <Button
          disabled={selectedFile ? false : true}
          onClick={methods.handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#673ab7',
            border: '1px solid #673ab7',
            marginTop: '35px',
            height: '48px',
          }}
        >
          {!status ? (
            'Agregar'
          ) : (
            <Spinner animation="border" variant="light" size="sm" />
          )}
        </Button>
      </form>
    </FormProvider>
  );
}

export default AddProductsFormComponent;
