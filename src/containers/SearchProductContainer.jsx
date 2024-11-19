import React, { useEffect, useState } from 'react';
import SearchProductComponent from '../components/searchProduct/SearchProductComponent';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSupplierRequest } from '../redux/supplier';
import { deleteProductRequest, searchProductsRequest } from '../redux/product';
import Swal from 'sweetalert2';

function SearchProductContainer(props) {
  const [text, setText] = useState(null);
  const { data } = useSelector((state) => state.supplier);
  const products = useSelector((state) => state.product);
  // console.log(products);
  const methods = useForm();
  const dispatch = useDispatch();
  const search = (data) => {
    setText(data.campo);
    dispatch(searchProductsRequest({ page: 1, text: data.campo }));
  };
  const changePage = (page) => {
    dispatch(searchProductsRequest({ page: page, text: text }));
  };
  const resetSearch = () => {
    dispatch(searchProductsRequest({ page: 1, text: null }));
  };
  const deleteProduct = (id) => {
    // console.log(id);
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Vas a eliminar un producto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProductRequest(id))
          .then((res) => {
            if (!res.payload) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No es posible borrar el producto',
              });
              return;
            }
            Swal.fire({
              title: 'Eliminado!',
              text: 'El producto ya no está en los registros',
              icon: 'success',
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error en el servidor',
            });
          });
      }
    });
  };
  useEffect(() => {
    dispatch(getSupplierRequest());
    // dispatch(searchProductsRequest({ page: 1, text: null }));
  }, []);
  return (
    <SearchProductComponent
      {...props}
      methods={methods}
      onSubmit={search}
      suppliers={data}
      products={products}
      changePage={changePage}
      resetSearch={resetSearch}
      deleteProduct={deleteProduct}
    />
  );
}

export default SearchProductContainer;
