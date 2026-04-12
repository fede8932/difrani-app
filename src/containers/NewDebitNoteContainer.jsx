import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getMovementsByCurrentAcountIdX } from '../redux/searchCurrentAcount';
import { convertImageToBase64, waitForImagesToLoad } from '../utils';
import Swal from 'sweetalert2';
import { createDebitNoteRequest } from '../request/debitNoteRequest';
import { debitNoteHtml } from '../templates/debitNote';
import logoSanJorge from '../assets/logo/logoSanJorge.png';
import NewDebitNote from '../components/newDebitNote/NewDebitNote';

function NewDebitNoteContainer(props) {
  const [loading, setLoading] = useState(false);
  const { currentAcountId, acountState, ...rest } = props;
  const filterMovements = useSelector((state) => state.filterMovementsOrder);
  const dispatch = useDispatch();
  const methods = useForm();

  const importe = methods.watch('importe');
  const iva = methods.watch('iva');

  const saveDebitNote = async (data) => {
    setLoading(true);
    try {
      const importeNum =
        parseFloat(String(data.importe).replace(',', '.')) || 0;
      const ivaNum = parseFloat(String(data.iva || '0').replace(',', '.')) || 0;

      if (importeNum <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El importe debe ser mayor a 0',
          showConfirmButton: false,
          timer: 2500,
        });
        setLoading(false);
        return;
      }

      if (!data.descripcion || data.descripcion.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La descripción es obligatoria',
          showConfirmButton: false,
          timer: 2500,
        });
        setLoading(false);
        return;
      }

      const sendData = {
        currentAcountId: currentAcountId,
        importe: importeNum,
        iva: ivaNum,
        descripcion: data.descripcion.trim().toUpperCase(),
      };

      const result = await createDebitNoteRequest(sendData);

      await printDebitNote(result);

      dispatch(getMovementsByCurrentAcountIdX(filterMovements));
      rest.closeModal();

      Swal.fire({
        icon: 'success',
        title: 'Nota de débito creada',
        text: `Comprobante N° ${result.numComprobante}`,
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (error) {
      const message =
        error?.response?.data?.error ??
        error?.message ??
        'Ocurrió un error al crear la nota de débito.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const printDebitNote = async (debitNoteData) => {
    const client = acountState.data?.currentAcount?.client;
    const logoBase64 = await convertImageToBase64(logoSanJorge);
    const nuevaVentana = window.open('', '', 'width=900,height=1250');

    const container = nuevaVentana.document.createElement('div');
    nuevaVentana.document.body.appendChild(container);
    container.innerHTML = debitNoteHtml(debitNoteData, client, logoBase64);

    await waitForImagesToLoad(nuevaVentana);
    nuevaVentana.addEventListener('afterprint', () => {
      nuevaVentana.close();
    });
    nuevaVentana.print();
  };

  return (
    <NewDebitNote
      {...rest}
      methods={methods}
      onSubmit={saveDebitNote}
      loading={loading}
      importe={importe}
      iva={iva}
    />
  );
}

export default NewDebitNoteContainer;
