import React, { useState } from "react";
import styles from "./editSupplierView.module.css";
import Button from "react-bootstrap/esm/Button";
import CustomInput from "../../commonds/putInput/CustomInput";
import { FormProvider } from "react-hook-form";
import Spinner from "react-bootstrap/esm/Spinner";
import PutCustomTextArea from "../../commonds/putTextArea/PutCustomTextArea";
import Form from "react-bootstrap/Form";

function EditSupplierViewComponent(props) {
  const { supplier, update, methods, loading } = props;
  const [readOnly, setReadOnly] = useState(true);
  return (
    <div className={styles.editContainer}>
      <div className={styles.dataContainer}>
        <span>
          Supplier ID:<span className={styles.dataUser}>{supplier.id}</span>
        </span>
        <span>
          Proveedor:
          <span className={styles.dataUser}>{supplier.razonSocial}</span>
        </span>
        <span>
          IVA:<span className={styles.dataUser}>No definido</span>
        </span>
        <Form.Check // prettier-ignore
          type="switch"
          id="custom-switch"
          label="Editar"
          onChange={() => {
            setReadOnly(!readOnly);
          }}
        />
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(update)}
          className={styles.formContainer}
        >
          <div className={styles.inputContainer}>
            <div className={styles.leftInputContainer}>
              <span className={styles.inputLabel}>Razón Social</span>
              <CustomInput
                readOnly={readOnly}
                name="razonSocial"
                type="text"
                width="large"
                placeholder="Nombre"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                defaultValue={supplier.razonSocial}
              />
              <span className={styles.inputLabel}>Email</span>
              <CustomInput
                readOnly={readOnly}
                name="email"
                type="email"
                width="large"
                placeholder="Correo electrónico"
                icon="fa-regular fa-envelope"
                validate={{
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ingrese un correo electrónico válido",
                  },
                }}
                defaultValue={supplier.email}
              />
              <span className={styles.inputLabel}>CUIT</span>
              <CustomInput
                readOnly={readOnly}
                name="cuit"
                type="text"
                width="large"
                placeholder="Cuit"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                defaultValue={supplier.cuit}
              />
              <span className={styles.inputLabel}>Localidad</span>
              <CustomInput
                readOnly={readOnly}
                name="localidad"
                type="text"
                width="large"
                placeholder="Localidad"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
                defaultValue={supplier.localidad}
              />
              <span className={styles.inputLabel}>Calle</span>
              <CustomInput
                readOnly={readOnly}
                name="calle"
                type="text"
                width="large"
                placeholder="Calle"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
                defaultValue={supplier.calle}
              />
            </div>
            <div className={styles.rigthInputContainer}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "50%", padding: "0px 5px 0px 0px" }}>
                  <span className={styles.inputLabel}>Altura</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="altura"
                    type="text"
                    width="complete"
                    placeholder="Altura"
                    icon="fa-solid fa-location-dot"
                    validate={{ required: true, maxLength: 10 }}
                    defaultValue={supplier.altura}
                  />
                </div>
                <div style={{ width: "50%", padding: "0px 0px 0px 5px" }}>
                  <span className={styles.inputLabel}>Código postal</span>
                  <CustomInput
                    readOnly={readOnly}
                    name="codigoPostal"
                    type="text"
                    width="complete"
                    placeholder="Código postal"
                    icon="fa-solid fa-location-dot"
                    validate={{ required: true, maxLength: 10 }}
                    defaultValue={supplier.codigoPostal}
                  />
                </div>
              </div>
              <span className={styles.inputLabel}>Teléfono</span>
              <CustomInput
                readOnly={readOnly}
                name="telefono"
                type="text"
                width="large"
                placeholder="Número de teléfono"
                icon="fa-solid fa-phone"
                validate={{
                  required: true,
                  validate: (value) => {
                    const isValid = /^\d{8,10}$/.test(value);
                    if (!isValid) {
                      return "El número de teléfono debe tener entre 8 y 10 dígitos";
                    }
                  },
                }}
                defaultValue={supplier.telefono}
              />
              <span className={styles.inputLabel}>Comentarios</span>
              <PutCustomTextArea
                name="comentarios"
                width="large"
                placeholder="En este campo puedes ingresar descripciones... (Máximo 160 caracteres)"
                type="textarea"
                validate={{ required: false, maxLength: 160 }}
                defaultValue={supplier.comentarios}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonSubContainer}>
              <Button
                disabled={readOnly}
                type="submit"
                style={{
                  backgroundColor: "#673ab7",
                  border: "1px solid #673ab7",
                  height: "35px",
                  width: "100px",
                  marginLeft: "10px",
                }}
              >
                {!loading ? (
                  "Actualizar"
                ) : (
                  <Spinner animation="border" variant="light" size="sm" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditSupplierViewComponent;
