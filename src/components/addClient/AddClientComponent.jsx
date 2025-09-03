import React from "react";
import styles from "./addClient.module.css";
import CustomInput from "../../commonds/input/CustomInput";
import Button from "react-bootstrap/Button";
import { FormProvider } from "react-hook-form";
import CustomSelect from "../../commonds/select/CustomSelect";
import Spinner from "react-bootstrap/esm/Spinner";

function AddClientComponent(props) {
  const { onSubmit, status, methods, sellers } = props;
  return (
    <div className={styles.formContainer}>
      <FormProvider {...methods}>
        <form>
          <div className={styles.subFormContainer}>
            <div className={styles.inputContainer}>
              <span className={styles.subTitle}>Datos de usuario</span>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <CustomInput
                  name="name"
                  type="text"
                  width="small"
                  placeholder="Nombre"
                  icon="fa-solid fa-id-card"
                  validate={{ required: true, maxLength: 45 }}
                />
                <CustomInput
                  name="lastName"
                  type="text"
                  width="small"
                  placeholder="Apellido"
                  icon="fa-solid fa-id-card"
                  validate={{ required: true, maxLength: 45 }}
                />
              </div>
              <CustomInput
                name="razonSocial"
                type="text"
                width="large"
                placeholder="Razon social"
                icon="fa-solid fa-id-card"
                validate={{ required: true, maxLength: 150 }}
              />
              <CustomInput
                name="cuit"
                type="text"
                width="large"
                placeholder="Cuit"
                icon="fa-solid fa-id-card"
                validate={{
                  required: true,
                  pattern: {
                    value: /^\d{2}-\d{8}-\d{1}$/,
                    message: "El CUIT debe tener el formato 99-99999999-9",
                  },
                }}
              />
              <CustomInput
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
              />
            </div>
            <div className={styles.inputContainer}>
              <span className={styles.subTitle}>Datos adicionales</span>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <CustomInput
                  name="calle"
                  type="text"
                  width="xmedium"
                  placeholder="Calle"
                  icon="fa-solid fa-location-dot"
                  validate={{ required: true, maxLength: 225 }}
                />
                <CustomInput
                  name="altura"
                  type="text"
                  width="extraSmall"
                  placeholder="Altura"
                  icon="fa-solid fa-location-dot"
                  validate={{ required: true, maxLength: 10 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <CustomInput
                  name="codigoPostal"
                  type="text"
                  width="extraSmall"
                  placeholder="Código postal"
                  icon="fa-solid fa-location-dot"
                  validate={{ required: true, maxLength: 10 }}
                />
                <CustomInput
                  name="telefono"
                  type="text"
                  width="extraSmall"
                  placeholder="Teléfono"
                  icon="fa-solid fa-phone"
                  validate={{
                    required: true,
                    /*validate: (value) => {
                      const isValid = /^\d{8,10}$/.test(value);
                      if (!isValid) {
                        return "El número de teléfono debe tener entre 8 y 10 dígitos";
                      }
                    },*/
                  }}
                />
                <CustomInput
                  name="coordenadas"
                  type="text"
                  width="extraSmall"
                  placeholder="Coordenadas"
                  icon="fa-solid fa-location-dot"
                  validate={{
                    required: false,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
              <CustomInput
                name="localidad"
                type="text"
                width="small"
                placeholder="Localidad"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
              />
              <CustomInput
                name="state"
                type="text"
                width="small"
                placeholder="Provincia"
                icon="fa-solid fa-location-dot"
                validate={{ required: true, maxLength: 25 }}
              />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "49%" }}>
                  <CustomSelect
                    name="iva"
                    text="Seleccioná el tipo de iva"
                    arrayOptions={[
                      {
                        value: "ResponsableInscripto",
                        text: "ResponsableInscripto",
                      },
                      { value: "Monotributista", text: "Monotributista" },
                      { value: "Excento", text: "Excento" },
                      { value: "NoGravado", text: "NoGravado" },
                      { value: "Final", text: "Final" },
                    ]}
                    validate={{ required: true }}
                  />
                </div>
                <div style={{ width: "49%" }}>
                  {sellers && (
                    <CustomSelect
                      name="sellerId"
                      text="Seleccioná un vendedor"
                      arrayOptions={sellers}
                      validate={{ required: true }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <Button
        onClick={methods.handleSubmit(onSubmit)}
        style={{
          backgroundColor: "#673ab7",
          border: "1px solid #673ab7",
          marginTop: "35px",
          height: "35px",
          width: "80px",
        }}
      >
        {status ? (
          <Spinner animation="border" variant="light" size="sm" />
        ) : (
          "Agregar"
        )}
      </Button>
    </div>
  );
}

export default AddClientComponent;
