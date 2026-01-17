import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import BrandPaymentDiscountComponent from '../components/brandSale/BrandPaymentDiscountComponent';
import {
  deleteBrandPaymentDiscountRequest,
  getBrandPaymentDiscountsRequest,
  newBrandPaymentDiscountRequest,
  resetBrandPaymentDiscount,
  toggleBrandPaymentDiscountRequest,
} from '../redux/brandPaymentDiscount';

function BrandPaymentDiscountContainer() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const id = Number(pathname.split('/')[3]);
  const methods = useForm();

  const { list, loading } = useSelector((state) => state.brandPaymentDiscount);
  const { selectBrand } = useSelector((state) => state.brandResults);

  const newDiscount = (data) => {
    const sendData = { ...data };
    sendData.percentage = Number(data.percentage) / 100;
    sendData.brandId = id;
    dispatch(newBrandPaymentDiscountRequest(sendData)).then((res) => {
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
      dispatch(getBrandPaymentDiscountsRequest(id));
    });
  };

  const deleteDiscount = (discountId) => {
    dispatch(deleteBrandPaymentDiscountRequest(discountId)).then((res) => {
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
    dispatch(toggleBrandPaymentDiscountRequest(discountId));
  };

  useEffect(() => {
    dispatch(getBrandPaymentDiscountsRequest(id));
    return () => dispatch(resetBrandPaymentDiscount());
  }, []);

  return (
    <BrandPaymentDiscountComponent
      methods={methods}
      newDiscount={newDiscount}
      deleteDiscount={deleteDiscount}
      toggleDiscount={toggleDiscount}
      loading={loading}
      discounts={list}
      brand={selectBrand}
    />
  );
}

export default BrandPaymentDiscountContainer;
