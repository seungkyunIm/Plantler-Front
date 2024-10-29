import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [userNick, setUserNick] = useState('');
  const [userId, setUserId] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isNickChecked, setIsNickChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false); // 회원가입 완료 상태
  const navigate = useNavigate();  

  const handleNickCheck = () => {
    if (!userNick) {
      alert('닉네임을 입력해 주세요.');
      return;
    }

    axios
      .post(process.env.REACT_APP_BACK_HOST_URL + '/api/checkUserNick', { nick: userNick })
      .then((response) => {
        if (response.data.exists) {
          alert('닉네임이 이미 존재합니다.');
          setUserNick(''); // 닉네임 입력 박스 초기화
        } else {
          alert('사용 가능한 닉네임입니다.');
          setIsNickChecked(true);
        }
      })
      .catch((error) => {
        console.error('서버 요청 실패:', error);
        alert('요청 실패. 나중에 다시 시도해 주세요.');
      });
  };

  const handleIdCheck = () => {
    if (!userId) {
      alert('아이디를 입력해 주세요.');
      return;
    }

    axios
      .post(process.env.REACT_APP_BACK_HOST_URL + '/api/checkUserID', { id: userId })
      .then((response) => {
        if (response.data.exists) {
          alert('아이디가 이미 존재합니다.');
          setUserId(''); // 아이디 입력 박스 초기화
        } else {
          alert('사용 가능한 아이디입니다.');
          setIsIdChecked(true);
        }
      })
      .catch((error) => {
        console.error('서버 요청 실패:', error);
        alert('요청 실패. 나중에 다시 시도해 주세요.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isNickChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }
    if (!isIdChecked) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    const params = {
      user_id: userId,
      user_pwd: userPwd,
      user_email: userEmail,
      user_nick: userNick,
    };

    axios
      .post(process.env.REACT_APP_BACK_HOST_URL + '/api/save', params)
      .then((response) => {
        if (response.data.status === 'success') {
          alert(response.data.message); // 성공 메시지 표시
          setIsSignedUp(true); // 회원가입 성공 시 상태 변경
          navigate('/login');
        } else {
          alert(response.data.message); // 실패 메시지 표시
        }
      })
      .catch((error) => {
        console.error('서버 요청 실패:', error);
        alert('회원가입 처리 중 오류가 발생했습니다.');
      });
  };

  const goToMainEvent = () => {
    navigate('/');
  }

  return (
    <div className="signup-container" id="signup">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_nick">닉네임</label>
          <div className="input-group">
            <input
              type="text"
              id="user_nick"
              name="user_nick"
              placeholder="닉네임을 입력해 주세요."
              required
              value={userNick}
              onChange={(e) => setUserNick(e.target.value)}
              //  pattern="^[가-힣]{3,8}$" // 한글 4자에서 8자
              minLength={3} // 최소 길이 3
              maxLength={8} // 최대 길이 8
            />
            <button
              type="button"
              className="check-btn"
              onClick={handleNickCheck}
              disabled={isSignedUp} // 회원가입 완료 시 버튼 비활성화
            >
              중복 확인
            </button>
          </div>
          <span className="info">(3자 - 8자)</span>
        </div>
        <div className="form-group">
          <label htmlFor="user_id">아이디</label>
          <div className="input-group">
            <input
              type="text"
              id="user_id"
              name="user_id"
              placeholder="아이디를 입력해 주세요."
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              pattern="^[a-zA-Z0-9]{4,16}$" // 영문 대소문자 및 숫자 4자에서 16자
              minLength={4} // 최소 길이 4
              maxLength={16} // 최대 길이 16
            />
            <button
              type="button"
              className="check-btn"
              onClick={handleIdCheck}
              disabled={isSignedUp} // 회원가입 완료 시 버튼 비활성화
            >
              중복 확인
            </button>
          </div>
          <span className="info">(영문 대/소문자, 숫자 포함 4자 - 16자)</span>
        </div>
        <div className="form-group">
          <label htmlFor="user_pwd">비밀번호</label>
          <input
            type="password"
            id="user_pwd"
            name="user_pwd"
            placeholder="비밀번호를 입력해 주세요."
            required
            value={userPwd}
            onChange={(e) => setUserPwd(e.target.value)}
            pattern="^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$" // 영문, 숫자, 특수 기호 포함 8자에서 16자
            minLength={8} // 최소 길이 8
            maxLength={16} // 최대 길이 16
          />
          <span className="info">(영문, 숫자, 특수 기호 포함 8자 - 16자)</span>
        </div>
        <div className="form-group">
          <label htmlFor="user_email">이메일</label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            placeholder="이메일을 입력해 주세요."
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <button type="submit" className='signup' disabled={isSignedUp}>
          회원가입
        </button>{' '}
        {/* 회원가입 완료 상태일 때 버튼 비활성화 */}
      </form>
      <div className="footer-links">
        이미 계정이 있으신가요? <a href="/login">로그인</a>
      </div>
      <button className="btn_line" onClick={goToMainEvent}>메인으로</button>
    </div>
  );
}

export default Signup;
