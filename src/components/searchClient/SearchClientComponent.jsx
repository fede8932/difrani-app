import React from "react";
import styles from "./searchClient.module.css";
import RoleTableContainer from "../../containers/RoleTableContainer";
import CustomModal from "../../commonds/customModal/CustomModal";
import BillReport from "../facturaReports/BillReport";
import ProtectedComponent from "../../protected/protectedComponent/ProtectedComponent";
import { getClientsId, getClientsMovements } from "../../request/sellerRequest";

function SearchClientComponent(props) {
  const {
    result,
    redirectEditPercents,
    changePageFn,
    sellerId,
    color,
    setColor,
    inputValue,
    setInputValue,
    handleReset,
    pageSize,
    setPageSize
  } = props;

  const listClientDownload = async () => {
    try {
      getClientsId(sellerId);
    } catch (err) {
      console.log(err);
    }
  };
  const listClientMovementsDownload = async () => {
    try {
      getClientsMovements();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <div className={styles.inputContainer}>
          <span className={styles.subTitle}>Campos de filtrado</span>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {" "}
            <form className={styles.formC}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribí algo..."
                />
              </div>

              <div className={`mb-3`} style={{ marginLeft: "10px" }}>
                <select
                  className="form-select"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="verde">Verde</option>
                  <option value="azul">Azul</option>
                  <option value="rojo">Rojo</option>
                </select>
              </div>

              <button
                type="button"
                className={`btn btn-secondary ${styles.resetBut}`}
                onClick={handleReset}
              >
                Reset
              </button>
            </form>
            <div style={{display: "flex", alignItems: "center"}}>
              <div className={`${styles.refColor} ${styles.colorGreen}`}></div>16 días-
              <div className={`${styles.refColor} ${styles.colorBlue}`}></div>30 días-
              <div className={`${styles.refColor} ${styles.colorRed}`}></div>+30 días
            </div>
            <div>
              {sellerId ? (
                <div style={{ marginRight: "10px", display: "inline-block" }}>
                  <buton className={styles.iconB} onClick={listClientDownload}>
                    <i className="fa-solid fa-file-export"></i>
                    <span style={{ marginLeft: "4px" }}>Exportar lista</span>
                  </buton>
                </div>
              ) : null}
              {!sellerId ? (
                <ProtectedComponent listAccesss={[1, 2]}>
                  <buton
                    style={{ marginRight: "10px" }}
                    className={styles.iconB}
                    onClick={() => listClientMovementsDownload()}
                  >
                    <i className="fa-solid fa-list-check"></i>
                    <span style={{ marginLeft: "4px" }}>Descargar resumen</span>
                  </buton>
                </ProtectedComponent>
              ) : null}
              <ProtectedComponent listAccesss={[1, 2]}>
                <CustomModal
                  title="Descargar reporte de facturación"
                  size="lg"
                  actionButton={
                    <buton className={styles.iconB}>
                      <i className="fa-solid fa-download"></i>
                      <span style={{ marginLeft: "4px" }}>
                        Descargar facturación
                      </span>
                    </buton>
                  }
                  bodyModal={(props) => <BillReport {...props} />}
                  bodyProps={{ sellerId: sellerId }}
                />
              </ProtectedComponent>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <span className={styles.subTitle}>Detalle de clientes</span>
        <RoleTableContainer
          pageSize={pageSize}
          setPageSize={setPageSize}
          colum={[
            { title: "ID Cliente", width: "10%" },
            { title: "Razon Social", width: "25%" },
            { title: "CUIT", width: "15%" },
            { title: "C. Corriente", width: "15%" },
            { title: "Saldo", width: "15%" },
            { title: "Estado", width: "10%" },
            { title: "Acciones", width: "10%" },
          ]}
          result={result}
          redirectEditPercents={redirectEditPercents}
          changePageFn={changePageFn}
          type="client"
        />
      </div>
    </div>
  );
}

export default SearchClientComponent;
