import React, { useEffect, useState } from "react";
import NewMoviment from "../components/newMoviment/NewMoviment";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addPayToCurrentAcount,
  getMovementsByCurrentAcountId,
} from "../redux/searchCurrentAcount";
import {
  convertImageToBase64,
  filterMovsId,
  obtenerIds,
  redondearADosDecimales,
  waitForImagesToLoad,
} from "../utils";
import Swal from "sweetalert2";
import {
  getAllMovNoApplyRequest,
  marcToggleNoApplyRequest,
  resetMovNoApplyRequest,
} from "../redux/movNoApply";
import { payDetail } from "../templates/payDetail";
import logoBlase from "../assets/logo/logoBlase.png";
import { addCancelToCurrentAcount } from "../request/currentAcountRequest";

function NewMovimientContainer(props) {
  const [inactive, setInactive] = useState(false);
  const [selectState, setSelectState] = useState("p");
  const [method, setMethod] = useState({
    method: 2,
    fecha: new Date().toISOString(),
    fechaCobro: null,
  });
  // console.log(method);
  const itemList = useSelector((state) => state.listOrderItems);
  const { currentAcountId, acountState, ...rest } = props;
  // console.log(acountState);
  const listNcNoApply = useSelector((state) => state.movNoApply);
  // console.log(listNcNoApply);

  const listMov = acountState.data.movements.list.filter((mov) => mov.marc);
  const listNoApplyMarc = listNcNoApply.data.filter((noApply) => noApply.marc);
  const dispatch = useDispatch();
  const methods = useForm();
  const [checked, setChecked] = useState(false);
  const marcToggle = (movId) => {
    // console.log(movId);
    dispatch(marcToggleNoApplyRequest(movId));
  };
  const saveMoviment = (data) => {
    setInactive(true);
    if (
      method.fecha == null ||
      (method.method == 1 && method.fechaCobro == null)
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La fecha seleccionada es incorrecta",
      });
      return;
    }
    let saldoPend =
      redondearADosDecimales(
        listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0)
      ) - listNcNoApply.montoTotal;
    // return;
    saldoPend = checked ? saldoPend * (1 - 0.06) : saldoPend;
    if (saldoPend < Number(data.importe)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El importe no puede superar el saldo pendiente",
      });
      return;
    }
    const payData = {
      amount: Number(data.importe),
      billIdList: filterMovsId(listMov),
      discount: checked,
      ncIdList: obtenerIds(listNoApplyMarc),
      method: method,
      comprobanteVendedor: data.comprobanteVendedor,
      numOperation: data.numOperation,
      banco: data.banco,
      numCheque: data.numCheque,
    };
    dispatch(addPayToCurrentAcount(payData))
      .then((res) => {
        const { payload } = res;
        console.log(payload);
        dispatch(
          getMovementsByCurrentAcountId({
            currentAcountId: currentAcountId,
            pendingFilter: true,
            // rows: 10,
            // page: 1,
          })
        ).then((r) => {
          setInactive(false);
          rest.closeModal();
        });
        if (payload.length < 1) {
          //aca va el error
        } else {
          printPayDetail(
            acountState.data?.currentAcount?.client,
            payload[0]?.payDetail
          );
        }
      })
      .catch(() => {
        setInactive(false);
      });
  };

  const printPayDetail = async (client, payData) => {
    const nuevaVentana = window.open("", "", "width=900,height=625");
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);

    const containerRem = nuevaVentana.document.createElement("div");
    nuevaVentana.document.body.appendChild(containerRem);
    containerRem.innerHTML = payDetail(client, payData, logoBlaseBase64);
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener("afterprint", () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  const cancelFactFn = () => {
    setInactive(true);
    const payData = {
      billIdList: filterMovsId(listMov),
      ncIdList: obtenerIds(listNoApplyMarc),
    };
    addCancelToCurrentAcount(payData)
      .then((res) => {
        rest.closeModal();

        setInactive(false);
      })
      .catch(() => setInactive(false));
  };

  useEffect(() => {
    dispatch(getAllMovNoApplyRequest(currentAcountId));
    return () => {
      dispatch(resetMovNoApplyRequest());
    };
  }, []);
  return (
    <NewMoviment
      {...rest}
      setMethod={setMethod}
      method={method}
      listMov={listMov}
      listNcNoApply={listNcNoApply}
      methods={methods}
      onSubmit={saveMoviment}
      selectState={selectState}
      setSelectState={setSelectState}
      setChecked={setChecked}
      checked={checked}
      itemList={itemList}
      marcToggle={marcToggle}
      cancelFactFn={cancelFactFn}
      inactive={inactive}
    />
  );
}

export default NewMovimientContainer;
