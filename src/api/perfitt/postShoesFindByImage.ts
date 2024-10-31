import axios from 'axios';
import { BASE_URL } from '../../config/config';

export const postShoesFindByImage = async (image: string) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/shoes/find-by-image`,
      { message: { imageUri: image } },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
