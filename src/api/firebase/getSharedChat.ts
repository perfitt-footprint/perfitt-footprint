import { doc, getDoc } from "firebase/firestore";
import { db } from "../../service/firebase";
import { formatDate, getDate } from "../../hooks/useFormatDate";

export const getSharedChat = async (chatId: string, sharedId: string) => {
  try {
    const chatDoc = await getDoc(doc(db, "chat", chatId, 'shared', sharedId));
    if (chatDoc.exists()) {
      return {
        count: chatDoc.data().count,
        datetime: formatDate(getDate(chatDoc.data().datetime))
      };
    } else {
      console.log("해당 문서가 없습니다.");
      return null;
    }
  } catch (error) {
    throw error;
  }
};