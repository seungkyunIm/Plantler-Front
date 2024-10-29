import React, { createContext, useContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'provider', 'user_nick']);
  const navigate = useNavigate();

  useEffect(() => {
    // const localToken = localStorage.getItem('token');
    const cookieToken = cookies.token;
    if (cookieToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const historyBack = () => {
    window.history.back(-1);
  }

  const getToken = () => {
    return window.btoa(cookies.token);
  }

  const logout = () => {
    // 쿠키에서 정보 제거
    if (cookies.provider) {
      removeCookie("token", { path: '/' });
      removeCookie("provider", { path: '/' });
      removeCookie("user_nick", { path: '/' });
    }

    // 카카오 또는 네이버 로그아웃 처리
    if (cookies.provider && cookies.token) {
      const a_tl = document.createElement("a");
      const provider = cookies.provider;
      const token = cookies.token;
      removeCookie("token", { path: '/' });
      removeCookie("provider", { path: '/' });
        
        if (provider === "kakao") {
            window.location.href = process.env.REACT_APP_BACK_HOST_URL + '/api/kakao/logout?token=${token}';
        } else if (provider === "naver") {
           a_tl.setAttribute("href", "https://nid.naver.com/nidlogin.logout");
         //   window.location.href =`https://nid.naver.com/nidlogin.logout`;
            a_tl.setAttribute("target", "_blank");
            a_tl.click();
            setIsLoggedIn(false);
            navigate("/");
          }

    }

    // 어떤 조건에도 해당하지 않을 경우
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, historyBack, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
