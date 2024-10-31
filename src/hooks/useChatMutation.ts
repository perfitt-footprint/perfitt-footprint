import { useMutation } from '@tanstack/react-query';
import { TChatMessage } from '../types/db';
import { postChatCompletions } from '../api/perfitt/postChatCompletions';
import { postShoesFindByImage } from '../api/perfitt/postShoesFindByImage';

export const useChatResponseMutation = () => {
  return useMutation({
    mutationFn: async (message: TChatMessage) => {
      if (message.text) {
        return await postChatCompletions(message.text);
      } else if (message.image) {
        return await postShoesFindByImage(message.image as string);
      }
      throw new Error("Unable to send the message");
    },
  });
};
