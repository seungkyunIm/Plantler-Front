import React from 'react'; // React import
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router에서 navigate 가져오기
import { useCookies } from 'react-cookie';

const Logout = () => {
  const navigate = useNavigate(); // navigate 함수 초기화
  const [cookie, setCookie, removeCookie] = useCookies();

  const handleLogout = (event) => {
    event.preventDefault(); // 기본 링크 동작 방지
    //document.location.href = "https://nid.naver.com/nidlogin.logout?returl=http://localhost:3000/login";
    
    if(cookie.provider && cookie.token) {
      const a_tl = document.createElement("a");
      const provider = cookie.provider;
      const token = cookie.token;
      removeCookie("token");
      removeCookie("provider");
      if(provider === "kakao") {
        window.location.href = process.env.REACT_APP_BACK_HOST_URL + '/api/kakao/logout?token=' + token;
      }
      if(provider === "naver") {
        a_tl.setAttribute("href", "https://nid.naver.com/nidlogin.logout");
        a_tl.setAttribute("target", "_blank");
        a_tl.click();
        navigate("/");
      }
      
    }
    return;
    // 소셜 로그아웃 요청
    axios
      .get(process.env.REACT_APP_BACK_HOST_URL + '/api/logout', {}, { withCredentials: true })
      .then((response) => {
        console.log(response);
        // 일반 회원 로그아웃
        if (response.status === 200) {
          // 200 상태 코드 확인
          // 로컬스토리지에서 토큰 삭제
          //   localStorage.removeItem('naver_auth_state'); //네이버 인증
          localStorage.removeItem('token');
          localStorage.removeItem('userNo');
          localStorage.removeItem('nick');
          navigate('/'); // 메인 페이지로 리다이렉트
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) =>
        console.error(
          'Error:',
          error.response ? error.response.data : error.message
        )
      );
  };

  return (
    <button id="logoutBtn" onClick={handleLogout}>
      로그아웃
    </button>
  );
};

export default Logout;
