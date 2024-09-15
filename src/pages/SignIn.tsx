import { useContext } from 'react';
import { AuthContext } from '../components/common/AuthContext';

const SignIn = () => {
  const userInfo = useContext(AuthContext);
  console.log(userInfo);

  return (
    <>
      <div className='App'>React - Typescript - Login</div>
      {userInfo ? (
        <div>
          <p>로그인한 사용자: {userInfo.email}</p>
        </div>
      ) : (
        <div>
          <p>로그인 정보가 없습니다.</p>
        </div>
      )}
    </>
  );
};

export default SignIn;
