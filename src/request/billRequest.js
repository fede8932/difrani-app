import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const getBillByIdRequest = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/movement/detail/${id}`, {
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

export const getBillItemsRequest = async (info) => {
  try {
    const { factNumber, currentAcountId, oficial } = info;
    const { data } = await axios.get(
      `${apiUrl}/api/movement/get/bill/items/${factNumber}/${currentAcountId}?oficial=${oficial}`,
      {
        withCredentials: true,
      }
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
