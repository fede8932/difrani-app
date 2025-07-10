import { useForm } from "react-hook-form";
import EditProduct from "../components/editProduct/EditProduct";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductIdRequest,
  resetSelectProduct,
} from "../redux/selectProduct";
import { useEffect, useState } from "react";
import {
  searchProductsExtraRequest,
  updateProductRequest,
} from "../redux/product";
import { getMinStock } from "../request/productRequest";

function EditProductContainer(props) {
  const filterProducts = useSelector((state) => state.filterProduct);
  // console.log("llega?", props);
  const { id, closeModal } = props;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [minStock, setMinStock] = useState(0);
  // console.log(selectedFiles);
  const selectProduct = useSelector((state) => state.selectProduct);
  const methods = useForm();
  const dispatch = useDispatch();

  const productUpdate = (data) => {
    data.stock = data.stock ? Number(data.stock) : null;
    data.price = data.price ? Number(data.price) : null;
    if (selectedFiles.length > 0) {
      data.images = selectedFiles;
    }
    // console.log("soy data", data);
    // return;
    dispatch(updateProductRequest({ productId: id, updateData: data })).then(
      (res) => {
        dispatch(searchProductsExtraRequest(filterProducts));
      }
    );
  };

  const genMinStock = async (id) => {
    try {
      const amount = await getMinStock(id);
      setMinStock(amount);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(getProductIdRequest(id));
    return () => {
      dispatch(resetSelectProduct(null));
    };
  }, []);
  useEffect(() => {
    if (selectProduct) {
      setMinStock(selectProduct.data?.stock?.minStock ?? 0);
    }
  }, [selectProduct]);

  // console.log(selectProduct);

  return (
    <EditProduct
      files={{
        selectedFiles: selectedFiles,
        setSelectedFiles: setSelectedFiles,
      }}
      methods={methods}
      product={selectProduct}
      update={productUpdate}
      genMinStock={genMinStock}
      minStock={minStock}
    />
  );
}

export default EditProductContainer;
