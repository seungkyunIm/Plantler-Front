import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindID = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // navigate 훅 사용

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const params = {
      user_email: email,
    };

    axios
      .post(process.env.REACT_APP_BACK_HOST_URL + '/api/findID', params)
      .then((response) => {
        if (response.data.user_id) {
          alert(`로그인 아이디는 "${response.data.user_id}" 입니다.`);
          navigate('/');
        } else {
          setError('유효한 사용자가 아닙니다.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('오류가 발생했습니다.');
      });
  };
  
  const goToMainEvent = () => {
    navigate('/');
  }

  return (
    <div className="find-id-container">
      <h2>아이디 찾기</h2>
      <form id="find-id-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_email">가입한 이메일로 찾기</label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            placeholder="이메일을 입력해 주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">아이디 찾기</button>
        <button className="btn_line" onClick={goToMainEvent}>메인으로</button>
      </form>
    </div>
  );
};

export default FindID;
