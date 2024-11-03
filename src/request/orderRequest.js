import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const createBuyOrder = async (objInfo) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/purchase/order/${objInfo.supplier}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const addOrderItem = async (dataOrder) => {
  try {
    const { productId, brandId, orderId, cantidad, type } = dataOrder;
    // console.log(type);
    let url = `${apiUrl}/api/purchase/order/items/${orderId}?productId=${productId}&brandId=${brandId}&cantidad=${cantidad}`;
    if (type) {
      url = url + `&type=${type}`;
    }

    // console.log(url);
    const { data } = await axios.post(url, null, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const deleteOrderItem = async (id) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/purchase/order/items/${id}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const deleteSellOrderItem = async (id) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/purchase/order/items/sell/${id}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getBuyOrder = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/purchase/order/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getSellOrderLocal = async (id) => {
  try {
    const order = {
      client: null,
      clientId: null,
      controlOrder: null,
      date: null,
      efective: false,
      id: 0,
      purchaseOrderItems: null,
      status: "Open",
      supplier: null,
      supplierId: null,
      total: 0,
      type: "Sell",
    };
    return order;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getOrderItems = async (orderId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/purchase/order/items/${orderId}`,
      { withCredentials: true }
    );
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const updateOrderItem = async (dataItem) => {
  try {
    const { id, editCamp } = dataItem;
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/items/${id}?cantidad=${editCamp}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const updatePriceOrderItem = async (dataItem) => {
  try {
    const { id, editCamp } = dataItem;
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/items/price/${id}?price=${editCamp}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const updateStatusOrder = async (dataItem) => {
  try {
    const { id, status } = dataItem;
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/status/${id}?status=${status}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const updateClientStatusOrder = async (dataItem) => {
  try {
    const { id, status, clientId } = dataItem;
    const url = clientId
      ? `${apiUrl}/api/purchase/order/status/client/${id}?status=${status}&clientId=${clientId}`
      : `${apiUrl}/api/purchase/order/status/client/${id}?status=${status}`;
    const { data } = await axios.put(url, null, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const deleteSellOrder = async (orderId) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/purchase/order/delete/${orderId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const searchSellOrder = async (filter) => {
  try {
    let url = `${apiUrl}/api/purchase/order/search/sell`;
    const res = await axios.post(url, filter, { withCredentials: true });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const searchBuyOrder = async (filter) => {
  try {
    let url = `${apiUrl}/api/purchase/order/search/buy`;
    const res = await axios.post(url, filter, { withCredentials: true });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const deleteOrder = async (orderId) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/purchase/order/delete/${orderId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const cancelOrder = async (sendInfo) => {
  try {
    const { orderId, status } = sendInfo;
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/status/${orderId}?remito=${null}&status=${status}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const updateStatusOrderConfirm = async (sendInfo) => {
  try {
    const { orderId, status, remito, factura } = sendInfo;
    const { noFact, ...fact } = factura;
    const montoNoFact = noFact ? noFact : 0;
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/status/${orderId}?numRemito=${remito}&status=${status}&noFact=${montoNoFact}`,
      fact,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const addRemToOrderConfirm = async (sendInfo) => {
  try {
    const { orderId, remito } = sendInfo;
    const { data } = await axios.patch(
      `${apiUrl}/api/purchase/order/add/remito/${orderId}/${remito}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const addFacToOrderConfirm = async (sendInfo) => {
  try {
    const { orderId, factura } = sendInfo;
    factura.numFactura = Number(factura.numFactura);
    const { data } = await axios.post(
      `${apiUrl}/api/purchase/order/add/fact/${orderId}`,
      factura,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.log(error);

    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getOrderByIdRequest = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/purchase/order/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const createSellOrderRequest = async (clientId) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/purchase/order/sell/${clientId}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const confirmSellOrder = async (sendData) => {
  const { concepto, tipo_de_documento, tipo_de_factura, type, ...send } =
    sendData;
  try {
    // console.log(send);
    const { data } = await axios.post(
      `${apiUrl}/api/movement?concepto=${concepto}&tipo_de_documento=${tipo_de_documento}&tipo_de_factura=${tipo_de_factura}&type=${type}`,
      send,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const confirmSelectSellOrder = async (sendData) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/status/sellorder`,
      sendData,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const unificSelectSellOrder = async (sendData) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/purchase/order/unific/sellorder`,
      sendData,
      { withCredentials: true }
    );
    let res = { order: data, blackListId: [] };
    res.blackListId = sendData.orderIdList.filter((id) => id != data.id);
    return res;
  } catch (error) {
    error.message = error.response?.data ? error.response?.data : error.message;

    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const NewNCForOrder = async (sendData) => {
  const {
    motivo,
    concepto,
    tipo_de_documento,
    tipo_de_factura,
    type,
    currentAcountId,
    ...send
  } = sendData;
  try {
    console.log(send);
    const { data } = await axios.post(
      `${apiUrl}/api/movement/nc/${currentAcountId}?motivo=${motivo}&concepto=${concepto}&tipo_de_documento=${tipo_de_documento}&tipo_de_factura=${tipo_de_factura}&type=${type}`,
      send,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const confirmSellOrderWBill = async (sendData) => {
  const { tipo_de_factura, type, ...send } = sendData;
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/extra?concepto=tipo_de_factura=${tipo_de_factura}&type=${type}`,
      send,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const factItemToggle = async (itemId) => {
  try {
    const { data } = await axios.patch(
      `${apiUrl}/api/purchase/order/items/${itemId}`,
      null,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const printBillRequest = async (orderId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/bill/data/${orderId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getBillDataRequest = async (cbte, billType) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/bill/get/data`,
      {
        cbte: cbte,
        billType: billType,
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const printNCRequest = async (orderId, ncNum) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/nc/data/${orderId}/${ncNum}`,
      { withCredentials: true }
    );
    // console.log("verdata", data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const printNCByNumRequest = async (ncNum, currentAcountId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/nc/data/num/${ncNum}/${currentAcountId}`,
      { withCredentials: true }
    );
    // console.log("verdata", data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const printPresRequest = async (orderId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pres/data/${orderId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const rePrintPresRequest = async (id) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pres/get/data/${id}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const printNCPresRequest = async (orderId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pres/data/nc/${orderId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const printNCPresByNumRequest = async (compNum) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pres/data/nc/comp/${compNum}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getReport = async (sendData) => {
  // console.log(sendData);
  try {
    const { rows, page, init, end, brandId, clientId } = sendData;
    let url = `${apiUrl}/api/purchase/order/report/list/${rows}/${page}`;
    if (brandId || clientId) {
      url = `${url}?`;
      url = brandId ? `${url}brandId=${brandId}` : url;
      url = clientId && brandId ? `${url}&` : url;
      url = clientId ? `${url}clientId=${clientId}` : url;
    }
    console.log(url);
    const obj =
      init && end
        ? {
            params: {
              init: new Date(init).toISOString(),
              end: new Date(end).toISOString(),
            },
          }
        : null;
    const { data } = await axios.get(url, obj);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getDateReport = async () => {
  try {
    const url = `${apiUrl}/api/purchase/order/date`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const genOrderReport = async () => {
  try {
    const url = `${apiUrl}/api/purchase/order/gen/order`;
    const { data } = await axios.get(url, { withCredentials: true });
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
export const getListProductsClient = async (send) => {
  try {
    const { currentAcountId, text } = send;
    const url = text
      ? `${apiUrl}/api/purchase/order/list/buy/products/${currentAcountId}?text=${text}`
      : `${apiUrl}/api/purchase/order/list/buy/products/${currentAcountId}`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
