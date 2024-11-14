import { TChatMessage } from '../../../../types/db';
import { useChatStore } from '../../../../stores/chat.store';
import { useShareStore } from '../../../../stores/share.store';
import ChatProductCard from './ChatProductCard';
import ChatBrandCard from './ChatBrandCard';
import { exportIcon, thumbsDownIcon, upArrowIcon } from '../../../../assets/icons/icons';
import { useEffect, useRef } from 'react';

const ChatCardContainer = ({ products, brands }: TChatMessage) => {
  const isChat = window.location.pathname.startsWith('/chat');
  const { chatId, chatTitle } = useChatStore();
  const { setShareOpen } = useShareStore();

  const handleDislike = () => {};

  const handlePLP = () => {};

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (scrollContainerRef.current) {
        event.preventDefault();
        scrollContainerRef.current.scrollLeft += event.deltaY;
      }
    };
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className='flex flex-col gap-[9px] mt-2.5'>
      {products && (
        <div
          ref={scrollContainerRef}
          className={`flex gap-2.5 pl-11 overflow-x-scroll scrollbar-hide ${!isChat && 'pr-11'}`}
        >
          {products?.slice(0, 5).map((product, index) => (
            <ChatProductCard
              key={index}
              {...product}
            />
          ))}
          {isChat && (
            <button
              className='p-4 flex flex-col justify-center items-center gap-1.5'
              onClick={handlePLP}
            >
              <div className='w-[22px] h-[22px] rounded-full bg-black overflow-hidden'>
                <img
                  src={upArrowIcon}
                  alt='Show more'
                  className='w-[15px] h-[15px] m-[3.5px] rotate-90'
                />
              </div>
              <div className='w-[29px] text-[9px] leading-[11px]'>더보기</div>
            </button>
          )}
        </div>
      )}

      {brands && (
        <div
          ref={scrollContainerRef}
          className='flex gap-2.5 px-11 overflow-x-scroll scrollbar-hide'
        >
          {brands?.map((brand, index) => (
            <ChatBrandCard
              key={index}
              {...brand}
            />
          ))}
        </div>
      )}

      {isChat && (
        <div className='flex gap-2.5 ml-11'>
          <button onClick={() => setShareOpen(chatId, chatTitle)}>
            <img
              src={exportIcon}
              alt='Share chat'
            />
          </button>
          <button onClick={handleDislike}>
            <img
              src={thumbsDownIcon}
              alt='dislike'
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatCardContainer;
