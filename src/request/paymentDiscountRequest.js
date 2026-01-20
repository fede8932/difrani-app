import axios from 'axios';
import { convertToUpperCase } from '../utils';

const apiUrl = import.meta.env.VITE_API_URL;

export const getAllPaymentDiscounts = async () => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/payment-discount`,
      {
        withCredentials: true,
      }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const createPaymentDiscount = async (payload) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/payment-discount`,
      payload,
      {
        withCredentials: true,
      }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    if (error.response?.status == 400) {
      // Return the error message from backend
      return { error: error.response.data };
    }
    throw error;
  }
};

export const togglePaymentDiscount = async (id) => {
  try {
    const { data } = await axios.patch(
      `${apiUrl}/api/payment-discount/toggle/${id}`,
      null,
      {
        withCredentials: true,
      }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const deletePaymentDiscount = async (id) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/payment-discount/${id}`,
      {
        withCredentials: true,
      }
    );
    return convertToUpperCase(data);
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
