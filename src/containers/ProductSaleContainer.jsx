import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import ProductSaleComponent from '../components/productSale/ProductSaleComponent';
import { changePrioriProdSaleRequest, deleteProdSaleRequest, getProductIdRequest, newProdSaleRequest, resetSelectProduct, toggleStatusProdSaleRequest } from '../redux/selectProduct';

function ProductSaleContainer(props) {
  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const id = Number(pathname.split('/')[3]);
  const methods = useForm();

  const newSale = (data) => {
    const sendData = { ...data };
    sendData.percentage = Number(data.percentage) / 100;
    sendData.minUnit = Number(data.minUnit);
    sendData.minUnit = Number(data.minUnit);
    sendData.saleType = 1;
    sendData.productId = id;
    dispatch(newProdSaleRequest(sendData)).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No es posible guardar la oferta: ${res.error.message}`,
        });
        return;
      }
      methods.reset();
    });
  };

  const deleterSale = (id) => {
    dispatch(deleteProdSaleRequest(id)).then((res) => {
      if (res.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No es posible eliminar la oferta: ${res.error.message}`,
        });
        return;
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Oferta eliminada',
        showConfirmButton: false,
        timer: 800,
      });
    });
  };

  const toogleStatusSale = (id) => {
    dispatch(toggleStatusProdSaleRequest(id));
  };

  const changePriori = (id, mode) => {
    dispatch(changePrioriProdSaleRequest({ id: id, mode: mode }));
  };

  useEffect(() => {
    dispatch(getProductIdRequest(id));
    return () => dispatch(resetSelectProduct());
  }, []);

  return (
    <ProductSaleComponent
      methods={methods}
      newSale={newSale}
      deleterSale={deleterSale}
      toogleStatusSale={toogleStatusSale}
      changePriori={changePriori}
    />
  );
}

export default ProductSaleContainer;
