import React from "react";
import SellerFormComponent from "../components/sellerFormComponent/SellerFormComponent";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createSellersRequest } from "../redux/seller";
import Swal from "sweetalert2";

function SellerFormContainer(props) {
  const createSeller = useSelector((state) => state.seller.loading);
  const methods = useForm();
  const dispatch = useDispatch();
  const addSeller = (data) => {
    dispatch(createSellersRequest(data))
      .then((res) => {
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
    <SellerFormComponent
      {...props}
      onSubmit={addSeller}
      methods={methods}
      status={createSeller}
    />
  );
}

export default SellerFormContainer;
