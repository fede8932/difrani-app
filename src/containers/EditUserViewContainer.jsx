import React, { useEffect } from 'react';
import EditUserViewComponent from '../components/editUserView/EditUserViewComponent';
import { useForm } from 'react-hook-form';
import { UpdateSellersRequest } from '../redux/searchSeller';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerIdRequest, resetSellerStatus } from '../redux/seller';

function EditUserViewContainer(props) {
  const { seller, close, sellerId } = props;
  const { loading } = useSelector((state) => state.searchSellers);

  const useSeller = sellerId
    ? useSelector((state) => state.seller.data)[0]
    : seller;
  const methods = useForm({
    mode: 'onTouched',
  });
  const dispatch = useDispatch();
  const updateSeller = (data) => {
    const { ...sellerData } = data;
    sellerData.altura = Number(sellerData.altura);
    sellerData.codigoPostal = Number(sellerData.codigoPostal);
    sellerData.comisionBase = Number(sellerData.comisionBase) / 100;
    sellerData.comisionOferta = Number(sellerData.comisionOferta) / 100;
    sellerData.id = useSeller?.id;
    dispatch(UpdateSellersRequest(sellerData)).then(() => {
      close();
    });
  };

  useEffect(() => {
    dispatch(getSellerIdRequest(sellerId));
    return () => {
      dispatch(resetSellerStatus());
    };
  }, []);

  useEffect(() => {
    if (useSeller) {
      methods.reset({
        name: useSeller.user?.name || '',
        lastName: useSeller.user?.lastName || '',
        email: useSeller.user?.email || '',
        cuil: useSeller.cuil || '',
        calle: useSeller.calle || '',
        altura: useSeller.altura || '',
        codigoPostal: useSeller.codigoPostal || '',
        localidad: useSeller.localidad || '',
        telefono: useSeller.telefono || '',
        comisionBase: useSeller.comisionBase ? useSeller.comisionBase * 100 : 0,
        comisionOferta: useSeller.comisionOferta ? useSeller.comisionOferta * 100 : 0,
      });
    }
  }, [useSeller, methods]);

  return (
    <EditUserViewComponent
      {...props}
      seller={useSeller}
      update={updateSeller}
      methods={methods}
      loading={loading}
    />
  );
}

export default EditUserViewContainer;
