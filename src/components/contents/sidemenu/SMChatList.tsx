import { TChat } from '../../../types/db';
import { useShareStore } from '../../../stores/share.store';
import { chatIcon, exportIcon, trashRedIcon } from '../../../assets/icons/icons';

type TSMChatListProps = {
  dateCategory: string;
  chatList: TChat[];
  handleLink: (link: string) => void;
  handleDelete: (dateCategory: string, chatId: string) => Promise<void>;
};

function SMChatList({ dateCategory, chatList, handleLink, handleDelete }: TSMChatListProps) {
  const { setShareOpen } = useShareStore();

  return (
    <div className='my-4 flex flex-col gap-1'>
      <div className='text-[14px] leading-6 font-semibold text-[#A1A1AA]'>{dateCategory}</div>
      {chatList.map(chat => (
        <div
          key={chat.chatId}
          className='relative w-full h-[34px]'
        >
          <button
            className='w-full h-full pr-[66px] flex items-center gap-2'
            onClick={() => handleLink(`/chat?id=${chat.chatId}`)}
          >
            <img
              src={chatIcon}
              alt='Chat'
              className='w-5 h-5'
            />
            <div className='flex-1 pr-2.5 text-left whitespace-nowrap overflow-scroll'>{chat.title}</div>
          </button>

          {/* 공유 & 삭제 */}
          <div className='absolute top-0 right-0 h-full flex gap-2.5'>
            <div className='w-[18px] h-full bg-gradient-to-r from-transparent to-white' />
            <div className='h-full flex opacity-80'>
              <button
                className='w-7 h-full hover:opacity-100'
                onClick={() => setShareOpen(chat.chatId, chat.title)}
              >
                <img
                  src={exportIcon}
                  alt='Share chat'
                  className='size-5 m-auto'
                />
              </button>
              <button
                className='w-7 h-full hover:opacity-100'
                onClick={() => handleDelete(dateCategory, chat.chatId)}
              >
                <img
                  src={trashRedIcon}
                  alt='Delete chat'
                  className='size-5 m-auto opacity-80'
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SMChatList;
