import React, { useRef } from 'react';
import styles from './simpleInputFile.module.css';
import { Button, Spinner } from 'react-bootstrap';

function SimpleInputFile(props) {
  const { setFile, importLoading } = props;
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Abre el cuadro de selección de archivo
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Actualiza el estado con el archivo seleccionado
    }
  };

  return (
    <Button
      onClick={handleButtonClick}
      className={styles.button}
      variant="success"
    >
      {importLoading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        'Importar compra'
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
    </Button>
  );
}

export default SimpleInputFile;
