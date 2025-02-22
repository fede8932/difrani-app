import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const clientRegister = async (datos) => {
  try {
    let { name, lastName, email, ...dataClient } = datos;
    const dataUser = {
      name: name,
      lastName: lastName,
      email: email,
      password: `${lastName}1234`,
      roleId: 4,
    };
    const userId = await axios.post(`${apiUrl}/api/users`, dataUser, {
      withCredentials: true,
    });
    dataClient.userId = userId.data;
    dataClient.altura = Number(dataClient.altura);
    dataClient.codigoPostal = Number(dataClient.codigoPostal);
    dataClient.sellerId = Number(dataClient.sellerId);
    const client = await axios.post(`${apiUrl}/api/client`, dataClient, {
      withCredentials: true,
    });
    return client.data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getClients = async (idReq) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client`, {
      withCredentials: true,
    });
    const arrayClients = data.map((client) => {
      return {
        label: client.razonSocial.toUpperCase(),
        text: client.razonSocial.toUpperCase(),
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
      window.location.href = '/';
    }
    throw error;
  }
};

export const getAllClients = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client?ext=true`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getClientsByData = async (dataSearch) => {
  try {
    const { text, page, pageSize, orderByColumn, sellerId } = dataSearch;
    const { data } = await axios.get(
      `${apiUrl}/api/client/data?text=${text}&page=${page}&pageSize=${pageSize}&orderByColumn=${orderByColumn}&sellerId=${sellerId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
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
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
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
      window.location.href = '/';
    }
    throw error;
  }
};

export const getAllClientByData = async (text) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client/all?text=${text}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/client/id?id=${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
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
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
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
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const selectPickingOrder = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/order/picking/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
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
      window.location.href = '/';
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
      window.location.href = '/';
    }
    throw error;
  }
};
