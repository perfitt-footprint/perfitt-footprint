import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../service/firebase";

export const updateUserProfile = async (uid: string, photo: string) => {
  try {
    await updateDoc(doc(db, 'user', uid), { profile: photo });
    return 'success';
  } catch (error) {
    throw error;
  }
};