// 신발장 메인 페이지

// 무한 스크롤?

import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useUserStore } from '../../stores/user.store';
import { useShoeRackStore } from '../../stores/shoerack.store';
import HeaderLayout from '../../layout/HeaderLayout';
import AuthPhotoUpdate from '../../components/common/auth/AuthPhotoUpdate';
import SREmpty from '../../components/contents/shoerack/SREmpty';
import SRShoeRack from '../../components/contents/shoerack/SRShoeRack';
import { plusCircleIcon, userIcon } from '../../assets/icons/icons';

function ShoeRack() {
  const { uid, isLoading } = useAuthStore();
  const { user } = useUserStore();
  const { shoeRack, fetchShoeRack } = useShoeRackStore();
  const profilePhotoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading) fetchShoeRack(uid);
  }, [isLoading, user]);

  return (
    <HeaderLayout
      title='신발장'
      back
    >
      <div className='h-full p-4 pt-0 flex flex-col'>
        {/* USER 기본 정보 */}
        <div className='flex gap-5 items-center py-[5px] px-3'>
          <div className='relative w-[50px] h-[50px]'>
            <img
              src={userIcon}
              alt='User profile picture'
              className='w-full h-full object-cover rounded-full'
            />
            <AuthPhotoUpdate
              photoRef={profilePhotoRef}
              className='absolute bottom-0 right-0 w-[16px] h-[16px]'
            >
              <img
                src={plusCircleIcon}
                alt='Edit user image'
              />
            </AuthPhotoUpdate>
          </div>
          <div className='flex flex-col gap-1'>
            <h3 className='text-[16px] font-semibold leading-5'>{user?.name}</h3>
            <p className='text-[14px] leading-[22px]'>평소 신는 사이즈 | {user?.size}</p>
          </div>
        </div>

        {/* 신발장 */}
        {shoeRack == undefined || shoeRack?.length === 0 ? <SREmpty /> : <SRShoeRack shoesList={shoeRack} />}
      </div>
    </HeaderLayout>
  );
}

export default ShoeRack;
