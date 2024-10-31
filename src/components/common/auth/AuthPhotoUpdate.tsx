import { ReactNode } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateUserProfile } from '../../../api/firebase/updateUserProfile';
import { uploadStorage } from '../../../api/firebase/uploadStorage';

type TAuthPhotoUpdateProps = {
  photoRef: React.MutableRefObject<HTMLInputElement | null>;
  className: string;
  children: ReactNode;
};

const AuthPhotoUpdate = ({ photoRef, className, children }: TAuthPhotoUpdateProps) => {
  const auth = getAuth();
  const user = auth.currentUser;

  const updateProfilePhoto = async (file: File) => {
    if (user) {
      try {
        const photoURL = await uploadStorage(`user/profile/${user.uid}`, file); // Firebase Storage
        await updateProfile(user, { photoURL }); // Firebase Auth
        await updateUserProfile(user.uid, photoURL); // Cloud Firestore

        alert('프로필 사진이 변경되었습니다.');
        window.location.reload();
      } catch (error) {
        alert('프로필 사진 변경 실패');
        console.log('프로필 사진 변경 실패: ', error);
      }
    } else {
      alert('프로필 사진 변경 실패');
      window.location.reload();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    if (photo) await updateProfilePhoto(photo);
  };

  return (
    <>
      <input
        type='file'
        accept='image/*'
        ref={photoRef}
        onChange={handleFileChange}
        className='hidden'
      />
      <button
        className={className}
        onClick={() => photoRef.current?.click()}
      >
        {children}
      </button>
    </>
  );
};

export default AuthPhotoUpdate;
