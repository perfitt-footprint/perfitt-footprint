import { addDoc, collection } from "firebase/firestore";
import { db } from "../../service/firebase";

export const createChat = async (title: string) => {
  try {
    const chatDoc = await addDoc(collection(db, 'chat'), {
      title: title,
      datetime: new Date()
    })
    return chatDoc.id;
  } catch (error) {
    throw error;
  }
};