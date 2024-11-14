import { useEffect, useRef, useState } from 'react';
import { TChatMessage } from '../../../../types/db';
import { getQuestionRecommend } from '../../../../api/perfitt/getQuestionRecommend';

type TChatQuestionsProps = {
  sendMessage: (message: TChatMessage) => Promise<'success' | null>;
};

const ChatQuestions = ({ sendMessage }: TChatQuestionsProps) => {
  const [questions, setQuestions] = useState<{ question: string }[]>();

  useEffect(() => {
    const getData = async () => {
      const data = await getQuestionRecommend();
      setQuestions(data);
    };
    getData();
  }, []);

  const splitQuestion = (question: string) => {
    const middleIndex = Math.floor(question.length / 2) + 1;
    let splitIndex = question.lastIndexOf(' ', middleIndex);
    if (splitIndex === -1) splitIndex = middleIndex;

    const firstLine = question.slice(0, splitIndex);
    const secondLine = question.slice(splitIndex + 1);
    return (
      <>
        {firstLine}
        <br />
        {secondLine}
      </>
    );
  };
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  return (
    questions && (
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className='py-2.5 px-4 flex gap-2 overflow-x-auto scrollbar-hide'
      >
        {questions.map((q, index) => (
          <button
            key={index}
            className='py-[9.5px] px-3.5 bg-white rounded-[10px] shadow-[0_1px_2px_0_#00000033]
              text-xs/[18px] text-[#808080] flex-shrink-0'
            onClick={() => sendMessage({ text: q.question })}
          >
            {splitQuestion(q.question)}
          </button>
        ))}
      </div>
    )
  );
};

export default ChatQuestions;
