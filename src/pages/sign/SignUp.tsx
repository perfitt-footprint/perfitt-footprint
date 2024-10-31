// 회원가입

// select css
// 구글 팝업 에러
// 이메일 중복 검사
// 공백 제거
// 컴포넌트 분리

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, updateProfile } from 'firebase/auth';
import { auth } from '../../service/firebase';
import { TUserInfo } from '../../types/sign';
import { useUserStore } from '../../stores/user.store';
import { useSignStore } from '../../stores/sign.store';
import AuthContainer from '../../components/common/auth/AuthContainer';
import SUInfoBasic from '../../components/contents/sign/signup/SUInfoBasic';
import SUInfoSize from '../../components/contents/sign/signup/SUInfoSize';

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'basic' | 'size'>('basic');
  const { upsertUserInfo } = useUserStore();
  const [googleAuth, setGoogleAuth] = useState({
    uid: '',
    token: '',
  });
  const { googleUser, setGoogleUser, setSignSheetOpen, setSignSheetBody } = useSignStore();

  const methods = useForm<TUserInfo>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      gender: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      sizeType: '',
      size: '',
    },
  });

  // 구글 회원가입, 기본 정보 가져오기
  useEffect(() => {
    if (googleUser) {
      setGoogleAuth({ uid: googleUser.uid, token: googleUser.token || '' });
      methods.setValue('email', googleUser.email);
      methods.setValue('name', googleUser.name);
      methods.setValue('profile', googleUser.profile);
      setGoogleUser(undefined);
    }
  }, [googleUser]);

  // 회원가입, firestore User DB 저장
  const signUp = async (uid: string, data: TUserInfo) => {
    try {
      const result = await upsertUserInfo(uid, data);
      if (result === 'success') {
        setSignSheetOpen(false);
        setSignSheetBody(undefined);
        alert('회원가입 성공');
        navigate('/chat?mode=keyword');
      } else throw new Error('Failed Sign Up');
    } catch (error) {
      const user = auth.currentUser;
      await user?.delete();
      throw error;
    }
  };

  // Click Button
  const handleSubmit = async (data: TUserInfo) => {
    if (step === 'basic') setStep('size');
    else {
      try {
        if (!googleAuth.uid) {
          // 이메일 회원가입
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          await updateProfile(userCredential.user, { displayName: data.name });
          signUp(userCredential.user.uid, data);
        } else {
          // 구글 회원가입
          const googleCredential = GoogleAuthProvider.credential(googleAuth.token);
          await signInWithCredential(auth, googleCredential);
          signUp(googleAuth.uid, data);
        }
      } catch (error) {
        console.log('Failed Sign Up: ', error);
        setSignSheetOpen(false);
        setSignSheetBody(undefined);
        alert('회원가입 실패');
        navigate('/chat?mode=sign');
      }
    }
  };

  return (
    <AuthContainer
      title='회원가입'
      methods={methods}
      handleSubmit={methods.handleSubmit(handleSubmit)}
      btnText={step === 'basic' ? '다음' : '가입 완료'}
      formClassName={step === 'size' ? 'gap-6' : ''}
    >
      {step === 'basic' && <SUInfoBasic emailSignUp={!googleAuth.uid} />}
      {step === 'size' && <SUInfoSize />}
    </AuthContainer>
  );
}

export default SignUp;
