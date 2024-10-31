// 회원탈퇴

// checkbox css
// 구글 계정 확인

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { reauthenticateWithCredential, reauthenticateWithPopup } from 'firebase/auth';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth/web-extension';
import { auth } from '../../service/firebase';
import { deleteUser } from '../../api/firebase/deleteUser';
import { deleteUserProfileStorage } from '../../api/firebase/deleteUserProfileStorage';
import InfoMessage from '../../components/common/InfoMessage';
import AuthContainer from '../../components/common/auth/AuthContainer';
import AuthInput from '../../components/common/auth/AuthInput';
import SignCardBtn from '../../components/contents/sign/SignCardBtn';
import { chatIcon } from '../../assets/icons/icons';
import { googleLogo } from '../../assets/images/images';

type TAccountDelete = {
  acceptTerms: boolean;
  checkGoogle: boolean;
  password: string;
};

function ASDelete() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [isEmailUser, setIsEmailUser] = useState<boolean | null>(null);

  const deleteMessages = [
    '탈퇴 후 계정 복구가 불가능합니다.',
    '탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다.',
    '탈퇴 후에도 공유한 채팅 데이터는 삭제되지 않습니다.',
  ];

  const methods = useForm<TAccountDelete>({
    defaultValues: {
      acceptTerms: false,
      checkGoogle: false,
      password: '',
    },
  });
  const { control } = methods;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser?.providerData.some(provider => provider.providerId === 'password')) setIsEmailUser(true);
      else setIsEmailUser(false);
    });
    return () => unsubscribe();
  }, []);

  // 구글 계정 확인
  const checkGoogleUser = async () => {
    if (user) {
      try {
        // const googleProvider = new GoogleAuthProvider();
        // await reauthenticateWithPopup(user, googleProvider);
        methods.setValue('checkGoogle', true);
      } catch (error) {
        alert('인증 실패');
        console.error('인증 실패: ', error);
      }
    } else alert('인증 실패');
  };

  // 에러 메시지
  const handleError = (errors: any) => {
    const errorMessage =
      (isEmailUser ? errors.password?.message : errors.checkGoogle?.message) || errors.acceptTerms?.message;
    alert(errorMessage);
  };

  // 회원탈퇴
  const handleSubmit = async (data: TAccountDelete) => {
    try {
      if (!user) {
        alert('탈퇴 실패');
        navigate('/chat?mode=sign');
        return;
      }

      // email user 재인증
      if (isEmailUser) {
        const credential = EmailAuthProvider.credential(user.email!, data.password);
        await reauthenticateWithCredential(user, credential);
      }

      // 탈퇴
      await user.delete();
      const res1 = await deleteUserProfileStorage(user.uid);
      if (res1) {
        const res2 = await deleteUser(user.uid);
        if (res2) {
          alert('탈퇴되었습니다.');
          navigate('/chat?mode=sign');
        }
      }
    } catch (error) {
      alert('탈퇴 실패');
      console.log('탈퇴 실패: ', error);
    }
  };

  return (
    <AuthContainer
      title='회원탈퇴'
      methods={methods}
      handleSubmit={methods.handleSubmit(handleSubmit, handleError)}
      errorField={false}
      btnText='회원탈퇴'
    >
      <InfoMessage>탈퇴 안내 사항을 꼭 확인해주세요.</InfoMessage>
      <ul className='flex-1 flex flex-col gap-4 overflow-scroll'>
        {deleteMessages.map((message, index) => (
          <li
            key={index}
            className='flex items-start gap-2'
          >
            <img
              src={chatIcon}
              alt='info'
              className='w-4 h-4 mt-1 opacity-50'
            />
            <p className='text-[15px] leading-6'>{message}</p>
          </li>
        ))}
      </ul>
      <div className='flex flex-col mx-1'>
        <Controller
          name='acceptTerms'
          control={control}
          rules={{ required: '탈퇴 안내를 확인하고 동의해 주세요.' }}
          render={({ field }) => (
            <div className='flex justify-center gap-2 mb-3'>
              <input
                type='checkbox'
                id={field.name}
                name={field.name}
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
              />
              <label
                htmlFor='acceptTerms'
                className='text-base'
              >
                안내 사항을 모두 확인하였으며, 이에 동의합니다.
              </label>
            </div>
          )}
        />
        {isEmailUser && (
          <Controller
            name='password'
            control={control}
            rules={{ required: isEmailUser ? '비밀번호를 입력해 주세요.' : undefined }}
            render={({ field }) => (
              <AuthInput
                type='password'
                {...field}
                id={field.name}
                placeholder='비밀번호 입력'
                onChange={e => field.onChange(e.target.value)}
                autoComplete='current-password'
              />
            )}
          />
        )}
        {!isEmailUser && (
          <Controller
            name='checkGoogle'
            control={control}
            rules={{ required: !isEmailUser ? '구글 계정 확인이 필요합니다.' : undefined }}
            render={({ field }) => (
              <SignCardBtn
                image={!field.value ? googleLogo : undefined}
                text={!field.value ? 'Google 계정 확인' : '계정 확인 완료'}
                className={`${
                  !field.value
                    ? 'h-12 hover:bg-[#E4E4E7AA] border border-[#E4E4E7]'
                    : 'h-10 mt-1 text-[#A1A1AA] cursor-default'
                }`}
                onClick={!field.value ? checkGoogleUser : undefined}
              />
            )}
          />
        )}
      </div>
    </AuthContainer>
  );
}

export default ASDelete;
