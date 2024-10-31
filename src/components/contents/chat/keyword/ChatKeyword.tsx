import { useEffect, useState } from 'react';
import { TChatMessage } from '../../../../types/db';
import { getKeywords } from '../../../../api/perfitt/getKeywords';
import { postChatCompletionsKeywords } from '../../../../api/perfitt/postChatCompletionsKeywords';
import { createChat } from '../../../../api/firebase/createChat';
import Button from '../../../common/Button';
import Header from '../../../common/Header';
import { checkIcon } from '../../../../assets/icons/icons';

type TChatKeywordProps = {
  keywordMessage: TChatMessage;
  sendNewChatMessage: (chatId: string, messages: TChatMessage[]) => Promise<void>;
};

const ChatKeyword = ({ keywordMessage, sendNewChatMessage }: TChatKeywordProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  // 키워드 리스트 API
  const getData = async () => {
    const res = await getKeywords();
    setKeywords(res);
  };

  useEffect(() => {
    getData();
  }, []);

  // 키워드 선택
  const handleKeywordClick = (keyword: string) => {
    if (selected?.includes(keyword)) setSelected(selected.filter(item => item !== keyword));
    else setSelected(selected => [...selected, keyword]);
  };

  // 선택 완료
  const handleBtnClick = async () => {
    if (selected.length > 0) {
      try {
        const data = await postChatCompletionsKeywords(selected);
        if (data) {
          const messages = [
            { ...keywordMessage, id: 0 },
            {
              id: 1,
              sender: 'user',
              text: selected.join(', '),
            },
            {
              ...data,
              ...(data.products ? { products: data.products.slice(0, 5) } : {}),
              ...(data.brands ? { brands: data.brands.slice(0, 7) } : {}),
              text: data.message,
              id: 2,
              sender: 'AI',
            },
          ];

          const chatId = await createChat('관심 키워드');
          if (chatId) await sendNewChatMessage(chatId, messages);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    keywords && (
      <div
        className='absolute bottom-0 w-full max-h-screen pt-2 flex flex-col overflow-auto z-40
        rounded-t-3xl bg-white shadow-[0_-1px_4px_0_#00000026]'
      >
        <Header title='관심 키워드' />
        <div className='p-4 flex flex-wrap gap-x-1 gap-y-2.5'>
          {keywords.map((keyword, index) => (
            <button
              key={index}
              className={`py-2 px-4 rounded-full border text-base flex gap-1 items-center
                ${selected?.includes(keyword) ? 'text-[#9CA3AF] bg-[#F3F4F6] border-[#F3F4F6]' : 'text-black bg-white border-[#E4E4E7]'}`}
              onClick={() => handleKeywordClick(keyword)}
            >
              <img
                src={checkIcon}
                alt={keyword}
                className='w-4 h-4'
              />
              {keyword}
            </button>
          ))}
        </div>
        <div className={`py-4 px-5 ${selected.length <= 0 && 'opacity-30'}`}>
          <Button onClick={handleBtnClick}>{selected.length > 0 && `${selected.length}개`} 선택 완료</Button>
        </div>
      </div>
    )
  );
};

export default ChatKeyword;
