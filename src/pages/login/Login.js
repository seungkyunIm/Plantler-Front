import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import naverlogin from '../../assets/img/login/naverlogin.png';
import kakaologin from '../../assets/img/login/kakaologin.png';
import {useAuth} from './AuthContext';

const Login = () => {
  const {setIsLoggedIn} = useAuth();
  const [user, setUser] = useState({ id: '', pwd: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    if(cookie.token) {
      navigate('/');
    }
  }, [cookie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(process.env.REACT_APP_BACK_HOST_URL + '/api/login', user)
      .then((response) => {
        if (response.data.state) {
          alert(`${response.data.userDTO.user_nick}님 환영합니다.`);
          
          const now = new Date();
          const expires = new Date(now.setMonth(now.getMonth() + 1));
          setCookie('token', response.data.token, {expires, path: '/'});
          setCookie('provider', 'plantler', {expires, path: '/'});
          setCookie('user_nick', response.data.userDTO.user_nick, {expires, path: '/'});
          // localStorage.setItem('token', response.data.token);
          // localStorage.setItem('nick', response.data.userDTO.user_nick);
          // localStorage.setItem('userNo', response.data.userDTO.user_no);
          setIsLoggedIn(true);
          navigate('/');
        } else {
          setError(error);
          alert("유효한 사용자가 아닙니다.")
          setUser({ id: '', pwd: '' });
        }
      })
      .catch((err) => {
        console.error(err);
        setError('로그인 중 오류가 발생했습니다.');
      });
  };

  const handleNaverLogin = () => {
    window.location.href = process.env.REACT_APP_BACK_HOST_URL + '/api/login/naver';
  };

  const handleKakaoLogin = () => {
    window.location.href = process.env.REACT_APP_BACK_HOST_URL + '/api/login/kakao';
  };

  const goToMainEvent = () => {
    navigate('/');
  }

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            name="id"
            id="id"
            placeholder="아이디를 입력하세요."
            value={user.id}
            onChange={handleChange}
            required
          />
          <label htmlFor="pwd">비밀번호</label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            placeholder="비밀번호를 입력하세요."
            value={user.pwd}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">로그인</button>
        {/*      {error && <div className="error">{error}</div>} */}
      </form>
      <div className="links">
        <Link to="/findid">내 아이디 /</Link> {/* Link로 변경 */}
        <Link to="/findpwd">비밀번호 찾기</Link>
      </div>
      <button className="btn_line" onClick={goToMainEvent}>메인으로</button>
      <hr className="separation-line" />
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        <h5>소셜 로그인</h5>
      </div>
      <div className="social-login">
        {/*
        <button className="naver-login" onClick={handleNaverLogin}>
          <img src={naverlogin} alt="Naver Logo" />
        </button>
        */}
        <button className="kakao-login" onClick={handleKakaoLogin}>
          <img src={kakaologin} alt="Kakao Logo" />
        </button>
      </div>
      <div
        className="links"
        style={{ justifyContent: 'center', marginTop: '10px' }}
      >
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
};

export default Login;
