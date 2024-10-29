import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Findpwd = () => {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGetTempPassword = () => {
    setMessage('');
    setError('');

    axios
      .post(process.env.REACT_APP_BACK_HOST_URL+'/api/forgot-pwd', {
        user_id: userId,
        user_email: userEmail,
      })
      .then((response) => {
        setTempPassword(response.data.user_pwd); // 서버에서 받은 임시 비밀번호
        alert(
          '임시 비밀번호가 생성되었습니다. \n회원정보 페이지에서 비밀번호를 꼭 변경해주세요!'
        );
        setMessage('로그인 후 비밀번호를 변경해주세요.');
      })
      .catch((error) => {
        alert('잘못된 아이디와 이메일 주소 입니다.');
        setError(error.message); // 에러 메시지 추가
      });
  };
  
  const goToMainEvent = () => {
    navigate('/');
  }

  return (
    <div className="find-pw-container">
      <h2>비밀번호 찾기</h2>
      <form
        id="find-pw-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleGetTempPassword();
        }}
      >
        <div className="form-group">
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="가입시 등록한 아이디를 입력하세요."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            name="email"
            id="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="가입시 등록한 이메일을 입력하세요."
            required
          />
        </div>
        <button type="submit">임시 비밀번호 생성</button>
        <button className="btn_line" onClick={goToMainEvent}>메인으로</button>
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}
      {tempPassword && <p>임시 비밀번호: {tempPassword}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Findpwd;
