import React, { useState } from "react";
import styles from "./sellReport.module.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import NativeTableContainer from "../../containers/NativeTableContainer";
import { tabReport } from "../../utils";
import { DatePicker } from "antd";
import CustomSelect from "../../commonds/select/CustomSelect";
import { FormProvider, useForm } from "react-hook-form";

function SellReportComponent(props) {
  const { RangePicker } = DatePicker;
  const { filterFn, reportState, genOrder, brands, clients } = props;
  const methods = useForm();
  const { data, loading } = reportState;
  const [dateRange, setDateRange] = useState([]);
  const [brand, setBrand] = useState(null);
  const [client, setClient] = useState(null);
  const [dateStringRange, setStringDateRange] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  // console.log(loading);
  // console.log("VER BRANDS ====>", brands);

  const handleDateRangeChange = (dates, dateStrings) => {
    setDateRange(dates);
    setStringDateRange(dateStrings);
    if (dates == null) {
      filterFn({
        page: 1,
      });
    }
  };
  const completeBrand = brands
    ? [{ value: "", text: "Ninguno" }, ...brands]
    : [];
  const completeClient = clients
    ? [{ value: "", text: "Ninguno" }, ...clients]
    : [];

  const filter = (data) => {
    if (dateRange == null || dateRange.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
      setBrand(data.brand);
      setClient(data.client);
      filterFn({
        page: 1,
        init: dateStringRange[0],
        end: dateStringRange[1],
        brandId: data.brand,
        clientId: data.client,
      });
    }
  };

  const changePage = (page) => {
    filterFn({
      page: page,
      init: dateStringRange[0],
      end: dateStringRange[1],
      brandId: brand,
      clientId: client,
    });
  };
  // console.log(data);
  // console.log(dateStringRange, dateRange);
  const tableColumns = [
    { title: "Código", width: "15%", renderProp: "code" },
    { title: "Descripción", width: "45%", renderProp: "description" },
    { title: "Marca", width: "23%", renderProp: "brand" },
    { title: "Cantidad", width: "17%", renderProp: "amount" },
    // { title: "Acciones", width: "15%", renderProp: null },
  ];
  return (
    <div className={styles.formContainer}>
      <div className={styles.subFormContainer}>
        <div className={styles.inputContainer}>
          <span className={styles.subTitle}>Campos de filtrado</span>
          <FormProvider {...methods}>
            <form className={styles.searchContainer}>
              <div className={styles.filterContainer}>
                <div className={styles.rangeContainer}>
                  <RangePicker
                    onChange={handleDateRangeChange}
                    style={{ borderColor: isEmpty ? "red" : null }}
                  />
                </div>
                <CustomSelect
                  width="small"
                  name="client"
                  text="Sel. cliente"
                  arrayOptions={completeClient}
                  validate={{ required: false }}
                />
                <div style={{ marginLeft: "5px" }}></div>
                <CustomSelect
                  width="small"
                  name="brand"
                  text="Sel. marca"
                  arrayOptions={completeBrand}
                  validate={{ required: false }}
                />
                <div style={{ marginLeft: "5px" }}></div>
                <Button
                  onClick={methods.handleSubmit(filter)}
                  type="button"
                  style={{
                    backgroundColor: "#673ab7",
                    border: "1px solid #673ab7",
                    height: "32px",
                    width: "100px",
                    marginLeft: "10px",
                  }}
                >
                  {!loading ? (
                    "Filtrar"
                  ) : (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}
                </Button>
                <Button
                  onClick={methods.reset}
                  type="reset"
                  style={{
                    backgroundColor: "grey",
                    border: "1px solid grey",
                    height: "32px",
                    width: "100px",
                    marginLeft: "10px",
                  }}
                >
                  {!loading ? (
                    "Limpiar"
                  ) : (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}
                </Button>
              </div>
              <Button
                type="button"
                onClick={genOrder}
                style={{
                  backgroundColor: "grey",
                  border: "1px solid grey",
                  height: "32px",
                  width: "150px",
                  marginLeft: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <i className="fa-solid fa-cart-arrow-down"></i>
                  {!loading ? (
                    "Nuevo pedido"
                  ) : (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}
                </div>
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <span className={styles.subTitle}>Reporte de venta</span>
        <NativeTableContainer
          columns={tableColumns}
          dataRender={tabReport(data)}
          actions={[]}
          pagination={true}
          changePage={changePage}
        />
      </div>
    </div>
  );
}

export default SellReportComponent;
