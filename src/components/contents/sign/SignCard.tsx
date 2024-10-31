import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../../service/firebase';
import { useSignStore } from '../../../stores/sign.store';
import { useUserStore } from '../../../stores/user.store';
import SignIn from '../../../pages/sign/SignIn';
import SignUp from '../../../pages/sign/SignUp';
import SignCardBtn from './SignCardBtn';
import { googleLogo } from '../../../assets/images/images';

const SignCard = () => {
  const navigate = useNavigate();
  const { setGoogleUser, setSignSheetOpen, setSignSheetBody } = useSignStore();
  const { fetchUserInfo } = useUserStore();

  // 이메일 로그인
  const signInEmail = () => {
    setSignSheetBody(<SignIn />);
    setSignSheetOpen(true);
  };

  // 회원가입
  const signUp = () => {
    setSignSheetBody(<SignUp />);
    setSignSheetOpen(true);
  };

  // 구글 로그인/회원가입
  const signInGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(userCredential);
      const token = credential?.idToken;
      const user = userCredential.user;
      setGoogleUser({
        uid: user.uid,
        token: token || '',
        email: user.email || '',
        name: user.displayName || '',
        profile: user.photoURL || '',
      });

      const userData = await fetchUserInfo(user.uid);
      if (userData) navigate('/chat?mode=start');
      else {
        await signOut(auth);
        signUp();
      }
    } catch (error) {
      await signOut(auth);
      console.error('구글 인증 실패: ', error);
    }
  };

  return (
    <div className='w-[200px] mt-0.5 mx-11 p-2 flex flex-col gap-1.5'>
      <SignCardBtn
        text='이메일 로그인'
        onClick={signInEmail}
      />
      <SignCardBtn
        text='회원가입 하기'
        onClick={signUp}
      />
      <div className='w-full text-sm/[22px] text-center'>또는</div>
      <SignCardBtn
        image={googleLogo}
        text='Google'
        onClick={signInGoogle}
      />
    </div>
  );
};

export default SignCard;
