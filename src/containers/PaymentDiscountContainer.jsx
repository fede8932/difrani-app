import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import PaymentDiscountComponent from '../components/paymentDiscount/PaymentDiscountComponent';
import {
  deletePaymentDiscountRequest,
  getPaymentDiscountsRequest,
  newPaymentDiscountRequest,
  resetPaymentDiscount,
  togglePaymentDiscountRequest,
} from '../redux/paymentDiscount';

function PaymentDiscountContainer() {
  const dispatch = useDispatch();
  const methods = useForm();

  const { list, loading } = useSelector((state) => state.paymentDiscount);

  const newDiscount = (data) => {
    const sendData = { ...data };
    sendData.percentage = Number(data.percentage) / 100;
    dispatch(newPaymentDiscountRequest(sendData)).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No es posible guardar el descuento: ${res.error.message}`,
        });
        return;
      }
      methods.reset();
      // Refresh list after creation
      dispatch(getPaymentDiscountsRequest());
    });
  };

  const deleteDiscount = (discountId) => {
    dispatch(deletePaymentDiscountRequest(discountId)).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No es posible eliminar el descuento: ${res.error.message}`,
        });
        return;
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Descuento eliminado',
        showConfirmButton: false,
        timer: 800,
      });
    });
  };

  const toggleDiscount = (discountId) => {
    dispatch(togglePaymentDiscountRequest(discountId));
  };

  useEffect(() => {
    dispatch(getPaymentDiscountsRequest());
    return () => dispatch(resetPaymentDiscount());
  }, []);

  return (
    <PaymentDiscountComponent
      methods={methods}
      newDiscount={newDiscount}
      deleteDiscount={deleteDiscount}
      toggleDiscount={toggleDiscount}
      loading={loading}
      discounts={list}
    />
  );
}

export default PaymentDiscountContainer;
