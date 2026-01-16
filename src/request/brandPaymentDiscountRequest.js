import axios from 'axios';
import { convertToUpperCase } from '../utils';

const apiUrl = import.meta.env.VITE_API_URL;

export const getDiscountsByBrand = async (brandId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/brand-payment-discount/by-brand/${brandId}`,
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

export const createBrandPaymentDiscount = async (payload) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/brand-payment-discount`,
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

export const toggleBrandPaymentDiscount = async (id) => {
  try {
    const { data } = await axios.patch(
      `${apiUrl}/api/brand-payment-discount/toggle/${id}`,
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

export const deleteBrandPaymentDiscount = async (id) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/brand-payment-discount/${id}`,
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
