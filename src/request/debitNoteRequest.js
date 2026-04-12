import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const createDebitNoteRequest = async (sendData) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/debit-note`,
      sendData,
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
