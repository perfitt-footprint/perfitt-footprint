import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../service/firebase";

export const deleteUserChat = async (uid: string, chatId: string) => {
  try {
    await updateDoc(doc(db, 'userChat', uid), {
      chat: arrayRemove(chatId)
    });
    await deleteDoc(doc(db, 'chat', chatId));
    return 'success';
  } catch (error) {
    throw error;
  }
};