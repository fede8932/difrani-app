import React from "react";
import SupplierFormCmponent from "../components/supplierForm/SupplierFormComponent";
import { useDispatch, useSelector } from "react-redux";
import { supplierCreateRequest } from "../redux/supplier";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

function SupplierFormContainer(props) {
  const createSupplierStatus = useSelector((state) => state.supplier.loading);
  const methods = useForm();
  const dispatch = useDispatch();
  const addSupplier = (data) => {
    dispatch(supplierCreateRequest(data))
      .then((res) => {
        console.log("Registrado", res);
        if (res.error) {
          Swal.fire({
            title: "Error!",
            text: "No se pudo guardar tu registro",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Registrado con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
        methods.reset();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: "No se pudo registrar",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      });
  };
  return (
    <SupplierFormCmponent
      {...props}
      onSubmit={addSupplier}
      status={createSupplierStatus}
      methods={methods}
    />
  );
}

export default SupplierFormContainer;
