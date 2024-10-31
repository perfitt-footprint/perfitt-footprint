import axios from 'axios';
import { BASE_URL } from '../../config/config';

export const getHello = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/hello`);
    return res.data.response;
  } catch (error) {
    throw error;
  }
};
