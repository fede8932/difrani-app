import axios from "axios";
import { convertToUpperCase } from '../utils';
const apiUrl = import.meta.env.VITE_API_URL;

export const clientRegister = async (datos) => {
  try {
    let { ...dataClient } = datos;
    dataClient.altura = Number(dataClient.altura);
    dataClient.codigoPostal = Number(dataClient.codigoPostal);
    dataClient.sellerId = Number(dataClient.sellerId);
    // console.log(dataClient);
    const client = await axios.post(`${apiUrl}/api/client/add`, dataClient, {
      withCredentials: true,
    });
    return convertToUpperCase(client.data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const getClients = async (idReq) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client`, {
      withCredentials: true,
    });
    const upperData = convertToUpperCase(data);
    const arrayClients = upperData.map((client) => {
      return {
        label: client.razonSocial,
        text: client.razonSocial,
        value: idReq ? client.id : client.razonSocial,
        id: client.id,
      };
    });
    arrayClients.sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      }
      if (a.text > b.text) {
        return 1;
      }
      return 0;
    });
    return arrayClients;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const getAllClients = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client?ext=true`, {
      withCredentials: true,
    });
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const getClientsByData = async (dataSearch) => {
  try {
    const { text, page, pageSize, orderByColumn, sellerId, color } = dataSearch;
    let url = `${apiUrl}/api/client/data?page=${page}&pageSize=${pageSize}&orderByColumn=${orderByColumn}&sellerId=${sellerId}&color=${color}`;
    url = text != "" ? `${url}&text=${text}` : url;
    const { data } = await axios.get(url, { withCredentials: true });
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const getClientByData = async (dataSearch) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/client/dataclient?text=${dataSearch}`,
      { withCredentials: true }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const updateClientById = async (dataUpdate) => {
  try {
    const { id, ...infoUpdate } = dataUpdate;
    // console.log(infoUpdate)
    const { data } = await axios.put(
      `${apiUrl}/api/client/update/${id}`,
      infoUpdate,
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

export const getAllClientByData = async (text) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client/all?text=${text}`, {
      withCredentials: true,
    });
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client/id?id=${id}`, {
      withCredentials: true,
    });
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const getPickingOrder = async (filterData) => {
  try {
    const { order, rows, page } = filterData;
    const { data } = await axios.get(
      `${apiUrl}/api/order/picking?order=${order}&rows=${rows}&page=${page}`,
      { withCredentials: true }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const searchPickingOrder = async (filterData) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/order/picking/search/picking`,
      filterData,
      { withCredentials: true }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const selectPickingOrder = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/order/picking/${id}`, {
      withCredentials: true,
    });
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const updatePickingOrder = async (sendData) => {
  const { id } = sendData;
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/order/picking?id=${id}`,
      null,
      { withCredentials: true }
    );
    return { id: data };
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};

export const updatePrintPickingOrder = async (id) => {
  try {
    const { data } = await axios.patch(
      `${apiUrl}/api/order/picking/print/${id}`,
      null,
      { withCredentials: true }
    );
    return { id: data };
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = "/";
    }
    throw error;
  }
};
