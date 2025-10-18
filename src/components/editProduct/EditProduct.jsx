import CustomInput from "../../commonds/putInput/CustomInput";
import { FormProvider } from "react-hook-form";
import styles from "./editProduct.module.css";
import { Button, Spinner } from "react-bootstrap";
import FileInput from "../../commonds/inputFile/InputFile";
import ProtectedComponent from "../../protected/protectedComponent/ProtectedComponent";

function EditProduct(props) {
  const { methods, product, update, files, genMinStock, minStock, maxStock } = props;
  // console.log(product);
  return (
    <FormProvider {...methods}>
      <form>
        <div className={styles.inpFlex}>
          <div className={styles.medium}>
            <label>Artículo</label>
            <CustomInput
              readOnly={false}
              name="article"
              type="text"
              width="large"
              placeholder="Artículo"
              icon="fa-solid fa-id-card"
              validate={{ required: true }}
              value={product?.data?.article}
            />
          </div>
          <div className={styles.medium}>
            <label>Localización</label>
            <CustomInput
              readOnly={false}
              name="location"
              type="text"
              width="large"
              placeholder="Localización"
              icon="fa-solid fa-id-card"
              validate={{ required: false }}
              value={product?.data?.location}
            />
          </div>
        </div>
        <ProtectedComponent listAccesss={[1, 2, 5]}>
          <div className={styles.inpFlex}>
            <div className={styles.medium}>
              <label>Stock</label>
              <CustomInput
                readOnly={false}
                name="stock"
                type="text"
                width="large"
                placeholder="Stock"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                value={product?.data?.stock?.stock}
              />
            </div>
            <div className={styles.medium}>
              <label>Stock mínimo</label>
              <div style={{ display: "flex" }}>
                <CustomInput
                  readOnly={false}
                  name="minStock"
                  type="text"
                  width="medium"
                  placeholder="Stock mínimo"
                  icon="fa-solid fa-id-card"
                  validate={{ required: true }}
                  value={minStock}
                />
                <Button
                  onClick={() => {
                    genMinStock(product.data.id);
                  }}
                  variant="warning"
                  style={{ height: "40px", margin: "3px 0px 0px 5px" }}
                >
                  Generar
                </Button>
              </div>
            </div>
          </div>
        </ProtectedComponent>
        <ProtectedComponent listAccesss={[1, 2]}>
          <div className={styles.inpFlex}>
            <div className={styles.medium}>
              <label>Precio</label>
              <CustomInput
                readOnly={false}
                name="price"
                type="text"
                width="large"
                placeholder="Precio"
                icon="fa-solid fa-id-card"
                validate={{ required: true }}
                value={product?.data?.price?.price}
              />
            </div>
            <div className={styles.medium}>
              <label>Stock máximo</label>
              <div style={{ display: "flex" }}>
                <CustomInput
                  readOnly={false}
                  name="maxStock"
                  type="text"
                  width="medium"
                  placeholder="Stock máximo"
                  icon="fa-solid fa-id-card"
                  validate={{ required: true }}
                  value={maxStock}
                />
              </div>
            </div>
          </div>
        </ProtectedComponent>
        <div>
          <label>Descripción</label>
          <CustomInput
            readOnly={false}
            name="description"
            type="text"
            width="large"
            placeholder="Artículo"
            icon="fa-solid fa-id-card"
            validate={{ required: true }}
            value={product?.data?.description}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <ProtectedComponent listAccesss={[1, 2, 5, 6]}>
            <FileInput
              selectedFiles={files.selectedFiles}
              setSelectedFiles={files.setSelectedFiles}
            />
          </ProtectedComponent>
        </div>
        <div className={styles.buttoContainer}>
          <Button
            onClick={methods.handleSubmit(update)}
            type="button"
            style={{
              backgroundColor: "#673ab7",
              border: "1px solid #673ab7",
              height: "35px",
              width: "100px",
              marginLeft: "10px",
            }}
          >
            {!false ? (
              "Actualizar"
            ) : (
              <Spinner animation="border" variant="light" size="sm" />
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export default EditProduct;
