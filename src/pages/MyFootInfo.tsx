// 내 발 정보 페이지

// 내 발 측정 SDK 연동

import { useEffect } from 'react';
import HeaderLayout from '../layout/HeaderLayout';
import Button from '../components/common/Button';
import { footLoading } from '../assets/images/images';

function MyFootInfo() {
  useEffect(() => {
    (window as any).initializePerfittSize();
  }, []);

  return (
    <HeaderLayout
      title='내 발 정보'
      back
    >
      <div className='h-full flex flex-col p-4 pt-0'>
        <div className='flex-1 flex flex-col justify-center items-center'>
          <img
            src={footLoading}
            alt='No foot information'
            className='w-[284px] h-[191px]'
          />
          <div className='text-center mt-[-10px]'>
            <div className='text-[16px] leading-5 font-semibold'>발 정보가 아직 없습니다</div>
            <div className='mt-[8px] text-[#808080] leading-[22px]'>발 촬영으로 내 발 리포트를 받아보세요.</div>
          </div>
        </div>
        <Button>내 발 측정하기</Button>
      </div>
    </HeaderLayout>
  );
}

export default MyFootInfo;
