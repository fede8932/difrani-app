import React, { useEffect, useState } from 'react';
import NewMoviment from '../components/newMoviment/NewMoviment';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPayToCurrentAcount,
  getMovementsByCurrentAcountIdX,
} from '../redux/searchCurrentAcount';
import {
  convertImageToBase64,
  convertirStringANumero,
  filterMovsId,
  obtenerIds,
  redondearADosDecimales,
  waitForImagesToLoad,
} from '../utils';
import Swal from 'sweetalert2';
import {
  getAllMovNoApplyRequest,
  marcToggleNoApplyRequest,
  resetMovNoApplyRequest,
} from '../redux/movNoApply';
import { payDetail } from '../templates/payDetail';
import logoBlase from '../assets/logo/logoBlase.png';
import { addCancelToCurrentAcount } from '../request/currentAcountRequest';
import { getPaymentDiscountsRequest } from '../redux/paymentDiscount';

function NewMovimientContainer(props) {
  const [inactive, setInactive] = useState(false);
  const [cantTransf, setCantTransf] = useState(1);
  //Estado de activación de métodos de pago
  const [payMethod, setPayMethod] = useState({
    efectivo: true,
    cheque: false,
    transferencia: false,
  });

  //
  const [payChDate, setPayChDate] = useState([
    {
      fecha: new Date().toISOString(),
      fechaCobro: null,
    },
  ]);

  const changePayMethod = (name) => {
    let newPayMethod = { ...payMethod };
    newPayMethod[name] = !newPayMethod[name];
    //Si todas las propiedades son false no hago nada
    if (!Object.values(newPayMethod).every((value) => !value)) {
      setPayMethod(newPayMethod);
    }
  };

  // console.log(method);
  const itemList = useSelector((state) => state.listOrderItems);
  const filterMovements = useSelector((state) => state.filterMovementsOrder);
  const { currentAcountId, acountState, ...rest } = props;
  // console.log(acountState);
  const listNcNoApply = useSelector((state) => state.movNoApply);
  const paymentDiscounts = useSelector((state) => state.paymentDiscount.list);

  const listMov = acountState.data.movements.list.filter((mov) => mov.marc);
  const listNoApplyMarc = listNcNoApply.data.filter((noApply) => noApply.marc);
  const dispatch = useDispatch();
  const methods = useForm();
  const marcToggle = (movId) => {
    dispatch(marcToggleNoApplyRequest(movId));
  };

  const calculateDiscountDetails = (data) => {
    const details = [];
    let totalDiscount = 0;

    const getDiscountForMethod = (methodName) => {
      const discount = paymentDiscounts.find(
        (d) => d.paymentMethod.toLowerCase() === methodName.toLowerCase() && d.active
      );
      return discount ? discount.percentage : 0;
    };

    if (payMethod.efectivo && data.efImporte) {
      const amount = convertirStringANumero(data.efImporte);
      const discountPercentage = getDiscountForMethod('Cash');
      const discountAmount = amount * discountPercentage;
      if (discountPercentage > 0) {
        details.push({
          method: 'Efectivo',
          amount,
          percentage: discountPercentage * 100,
          discount: discountAmount,
        });
        totalDiscount += discountAmount;
      }
    }

    if (payMethod.transferencia) {
      for (let i = 0; i < cantTransf; i++) {
        if (data[`trImporte-${i}`]) {
          const amount = convertirStringANumero(data[`trImporte-${i}`]);
          const discountPercentage = getDiscountForMethod('Transfer');
          const discountAmount = amount * discountPercentage;
          if (discountPercentage > 0) {
            details.push({
              method: `Transferencia ${i + 1}`,
              amount,
              percentage: discountPercentage * 100,
              discount: discountAmount,
            });
            totalDiscount += discountAmount;
          }
        }
      }
    }

    if (payMethod.cheque) {
      for (let i = 0; i < payChDate.length; i++) {
        if (data[`chImporte-${i}`]) {
          const amount = convertirStringANumero(data[`chImporte-${i}`]);
          const discountPercentage = getDiscountForMethod('Cheque');
          const discountAmount = amount * discountPercentage;
          if (discountPercentage > 0) {
            details.push({
              method: `Cheque ${i + 1}`,
              amount,
              percentage: discountPercentage * 100,
              discount: discountAmount,
            });
            totalDiscount += discountAmount;
          }
        }
      }
    }

    return { details, totalDiscount };
  };
  const saveMoviment = async (data) => {
    let pcdLap = 0;
    //Acá lanzamos error cuando hay problemas con las fechas
    while (pcdLap < payChDate.length) {
      if (
        payChDate[pcdLap].fecha == null &&
        payChDate[pcdLap].fechaCobro == null
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La fecha seleccionada es incorrecta',
        });
        return;
      }
      pcdLap++;
    }

    setInactive(true); // Esto es para desacrtivar el boton de submit

    let dataCheque = { active: payMethod.cheque, cheques: [] };
    // console.log(payChDate)
    for (let i = 0; i < payChDate.length; i++) {
      dataCheque.active = payMethod.cheque;
      const cheqData = {
        date: payChDate[i].fecha,
        efectiveDate: payChDate[i].fechaCobro,
        entidad: data[`chBanco-${i}`],
        importe: convertirStringANumero(data[`chImporte-${i}`]),
        numero: data[`numCheque-${i}`],
      };
      dataCheque.cheques.push(cheqData);
    }

    let dataTran = { active: payMethod.transferencia, trans: [] };

    for (let i = 0; i < cantTransf; i++) {
      dataTran.active = payMethod.transferencia;
      const bankData = {
        numOperation: data[`numOperation-${i}`],
        entidad: data[`trBanco-${i}`],
        importe: convertirStringANumero(data[`trImporte-${i}`]),
      };
      dataTran.trans.push(bankData);
    }
    const efectiveData = {
      active: payMethod.efectivo,
      importe: convertirStringANumero(data.efImporte),
    };

    let totalPay = efectiveData.active ? efectiveData.importe : 0;
    totalPay = dataTran.active ? dataTran.trans.reduce((acum, tran) => acum + tran.importe, totalPay) : totalPay;
    totalPay = dataCheque.active ? dataCheque.cheques.reduce((acum, cheque) => acum + cheque.importe, totalPay) : totalPay;

    const saldoPend =
      redondearADosDecimales(
        listMov?.reduce((acum, mov) => acum + mov.saldoPend, 0)
      ) - listNcNoApply.montoTotal;

    if (saldoPend < totalPay) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El importe no puede superar el saldo pendiente',
      });
      setInactive(false);
      return;
    }

    const { details, totalDiscount } = calculateDiscountDetails(data);
    let applyDiscount = false;
    let finalDiscountAmount = 0;

    
    if (details.length > 0) {
      const discountHtml = `
        <div style="text-align: left; margin: 20px 0;">
          <p style="font-weight: bold; margin-bottom: 15px;">Descuentos disponibles por medio de pago:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Medio de pago</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Monto</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Descuento</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total desc.</th>
              </tr>
            </thead>
            <tbody>
              ${details.map(d => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${d.method}</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${d.amount.toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${d.percentage.toFixed(2)}%</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${d.discount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f0f8ff; font-weight: bold;">
                <td colspan="3" style="padding: 8px; text-align: right; border: 1px solid #ddd;">Total descuento:</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${totalDiscount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;

      const firstResult = await Swal.fire({
        title: '¿Aplicar descuentos por medio de pago?',
        html: discountHtml,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, aplicar descuentos',
        cancelButtonText: 'No, continuar sin descuentos',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        width: '600px',
      });

      if (firstResult.isConfirmed) {
        const totalACancelar = totalPay + totalDiscount;
        
        // Validar que el total a cancelar no exceda el saldo máximo
        if (totalACancelar > saldoPend) {
          const pagoMaximoPermitido = saldoPend / (1 + (totalDiscount / totalPay));
          const resultado = await Swal.fire({
            icon: 'warning',
            title: 'El descuento excede el saldo máximo',
            html: `
              <div style="text-align: left;">
                <p><strong>Saldo máximo a cancelar:</strong> $${saldoPend.toFixed(2)}</p>
                <p><strong>Monto del pago ingresado:</strong> $${totalPay.toFixed(2)}</p>
                <p><strong>Descuento a aplicar:</strong> $${totalDiscount.toFixed(2)}</p>
                <p><strong>Total a cancelar:</strong> $${totalACancelar.toFixed(2)}</p>
                <hr>
                <p style="color: #dc3545; font-weight: bold;">El total a cancelar excede el saldo máximo disponible.</p>
                <p style="margin-top: 15px;">Tenés dos opciones:</p>
                <div style="background-color: #e7f3ff; padding: 10px; border-radius: 5px; margin: 10px 0;">
                  <p style="margin: 5px 0;"><strong>Opción 1:</strong> Pagar el monto ajustado con descuento</p>
                  <p style="margin: 5px 0;">Monto a pagar: <strong style="background-color: #fff; padding: 4px 8px; border-radius: 4px; cursor: pointer; user-select: all;" onclick="this.select(); navigator.clipboard.writeText('${pagoMaximoPermitido.toFixed(2)}');">$${pagoMaximoPermitido.toFixed(2)}</strong></p>
                  <p style="font-size: 11px; color: #6c757d; margin: 5px 0;">💡 Clic para copiar</p>
                </div>
                <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                  <p style="margin: 5px 0;"><strong>Opción 2:</strong> Continuar sin descuentos</p>
                  <p style="margin: 5px 0;">Pagás el monto completo ($${totalPay.toFixed(2)}) sin aplicar descuentos</p>
                </div>
              </div>
            `,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Continuar sin descuentos',
            denyButtonText: 'Volver a ajustar el monto',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ffc107',
            denyButtonColor: '#007bff',
            cancelButtonColor: '#6c757d',
            width: '650px',
          });
          
          if (resultado.isConfirmed) {
            // Continuar sin descuentos
            applyDiscount = false;
            finalDiscountAmount = 0;
          } else {
            // Cancelar o volver
            setInactive(false);
            return;
          }
        } else {
          // Si no excede, mostrar confirmación normal
          const confirmationHtml = `
            <div style="text-align: left; margin: 20px 0;">
              <p style="margin-bottom: 15px;">Se va a registrar el siguiente pago:</p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">Saldo máximo a cancelar:</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${saldoPend.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Monto del pago:</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$${totalPay.toFixed(2)}</td>
                </tr>
                <tr style="background-color: #d4edda;">
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Descuento aplicado (NC):</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #155724;">+$${totalDiscount.toFixed(2)}</td>
                </tr>
                <tr style="background-color: #f0f8ff;">
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Total a descontar de deuda:</td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">$${totalACancelar.toFixed(2)}</td>
                </tr>
              </table>
              <p style="font-weight: bold; color: #856404; background-color: #fff3cd; padding: 10px; border-radius: 5px;">¿Confirmás el registro del pago con estos descuentos?</p>
            </div>
          `;

          const secondResult = await Swal.fire({
            title: 'Confirmación final',
            html: confirmationHtml,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar pago',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#dc3545',
            width: '600px',
          });

          if (secondResult.isConfirmed) {
            applyDiscount = true;
            finalDiscountAmount = totalDiscount;
          } else {
            setInactive(false);
            return;
          }
        }
      }
    }
    const payData = {
      pay: {
        dataTran: dataTran.active ? dataTran.trans : [],
        dataCheque: dataCheque.active ? dataCheque.cheques : [],
        dataEfective: efectiveData.active ? efectiveData.importe : 0,
      },
      billIdList: filterMovsId(listMov),
      discount: applyDiscount,
      discountAmount: finalDiscountAmount,
      ncIdList: obtenerIds(listNoApplyMarc),
      comprobanteVendedor: data.comprobanteVendedor,
    };
    dispatch(addPayToCurrentAcount(payData))
      .then((res) => {
        const { payload } = res;
        // console.log(payload);
        dispatch(getMovementsByCurrentAcountIdX(filterMovements)).then(() => {
          setInactive(false);
          rest.closeModal();
        });
        // dispatch(
        //   getMovementsByCurrentAcountId({
        //     currentAcountId: currentAcountId,
        //     pendingFilter: true,
        //     // rows: 10,
        //     // page: 1,
        //   })
        // ).then((r) => {
        //   setInactive(false);
        //   rest.closeModal();
        // });
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
    const nuevaVentana = window.open('', '', 'width=900,height=625');
    const logoBlaseBase64 = await convertImageToBase64(logoBlase);

    const containerRem = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(containerRem);
    containerRem.innerHTML = payDetail(client, payData, logoBlaseBase64);
    // Espera a que las imágenes se carguen antes de imprimir
    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
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
    dispatch(getPaymentDiscountsRequest());
    return () => {
      dispatch(resetMovNoApplyRequest());
    };
  }, []);
  return (
    <NewMoviment
      {...rest}
      setPayChDate={setPayChDate}
      payChDate={payChDate}
      listMov={listMov}
      listNcNoApply={listNcNoApply}
      methods={methods}
      onSubmit={saveMoviment}
      itemList={itemList}
      marcToggle={marcToggle}
      cancelFactFn={cancelFactFn}
      inactive={inactive}
      payMethod={payMethod}
      changePayMethod={changePayMethod}
      cantTransf={cantTransf}
      setCantTransf={setCantTransf}
    />
  );
}

export default NewMovimientContainer;
