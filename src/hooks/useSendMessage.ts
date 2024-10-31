import { useNavigate } from 'react-router-dom';
import { TChatMessage } from '../types/db';
import { useChatResponseMutation } from '../hooks/useChatMutation';
import { createChat } from '../api/firebase/createChat';
import { upsertChat } from '../api/firebase/upsertChat';
import { upsertUserChat } from '../api/firebase/upsertUserChat';
import { uploadStorage } from '../api/firebase/uploadStorage';

type TUseSendMessageProps = {
  uid: string;
  id?: string | null;
  messageIdRef: React.MutableRefObject<number>;
  setMessages: React.Dispatch<React.SetStateAction<TChatMessage[]>>;
};

const useSendMessage = ({ uid, id, messageIdRef, setMessages }: TUseSendMessageProps) => {
  const navigate = useNavigate();
  const { mutate: AIResponse } = useChatResponseMutation();

  // 이미지 업로드 (Firebase Storage)
  const uploadImage = async (image: File) => {
    const timestamp = Date.now();
    const imageURL = await uploadStorage(`chat/${id}/${timestamp}_${image.name}`, image);
    return imageURL;
  };

  // user message
  const getUserMessage = async (message: TChatMessage) => {
    if (message.image && typeof message.image !== 'string') {
      try {
        const imageURL = await uploadImage(message.image);
        return {
          ...message,
          image: imageURL,
          sender: 'user',
          id: ++messageIdRef.current,
        };
      } catch (error) {
        throw error;
      }
    } else {
      return {
        ...message,
        sender: 'user',
        id: ++messageIdRef.current,
      };
    }
  };

  // AI message API - text
  const getAIMessage = async (userMessage: TChatMessage) => {
    return new Promise((resolve, reject) => {
      AIResponse(userMessage, {
        onSuccess: async (data) => {
          const { message, ...rest } = data;
          const aiMessage: TChatMessage = {
            ...rest,
            ...(data.products ? { products: data.products.slice(0, 5) } : {}),
            ...(data.brands ? { brands: data.brands.slice(0, 7) } : {}),
            text: userMessage.image ? '이미지 검색 결과입니다.' : message,
            sender: 'AI',
            id: ++messageIdRef.current,
          };
          resolve(aiMessage);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  // 새 채팅 메시지 업데이트 & 채팅방 이동
  const sendNewChatMessage = async (chatId: string, messages: TChatMessage[]) => {
    try {
      for (const message of messages) await upsertChat(chatId, message);
      if (uid) {
        const res = await upsertUserChat(uid, chatId);
        if (res === 'success') navigate(`/chat?id=${chatId}`);
      } else navigate(`/chat?id=${chatId}`);
    } catch (error) {
      throw error;
    }
  }

  // send message
  const sendMessage = async (message: TChatMessage) => {
    try {
      if (id) {
        const userMessage = await getUserMessage(message);
        const res1 = await upsertChat(id, userMessage);
        if (res1 === 'success') {
          setMessages((prev) => [...prev, userMessage]);
          const aiMessage = await getAIMessage(userMessage);
          if (aiMessage) {
            const res2 = await upsertChat(id, aiMessage);
            if (res2 === 'success') setMessages((prev) => [...prev, aiMessage]);
          }
        }
      } else {
        const chatId = await createChat(message.text || '이미지 검색');
        if (chatId) {
          const userMessage = await getUserMessage(message);
          const aiMessage = await getAIMessage(userMessage);
          if (aiMessage) {
            const messages = [
              { ...userMessage, id: 1 },
              { ...aiMessage, id: 2 },
            ];
            await sendNewChatMessage(chatId, messages);
          }
        }
      }
      return 'success';
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return { sendMessage, sendNewChatMessage };
};

export default useSendMessage;
