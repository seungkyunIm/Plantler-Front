import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useCookies } from 'react-cookie'; // 쿠키 관리
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook

const Userinfo = () => {
    const [userInfo, setUserInfo] = useState({
        user_nick: '',
        user_email: '',
        user_id: '',
        user_pwd: '',
        user_no: null, // 초기값을 null로 변경
        provider: '' // provider 추가
    });
    const [isNickChecked, setIsNickChecked] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const [error, setError] = useState(''); // 에러 메시지 상태 추가
    const [cookies, setCookie] = useCookies(['token', 'provider', 'user_nick']); // 쿠키 관리
    const navigate = useNavigate(); 
    const { logout } = useAuth();

    useEffect(() => {
        const { token } = cookies;
        // console.log(token);
        if (!token) {
            alert("Plantler 회원이 되어주세요!");
            navigate('/signup'); // 페이지 이동
        } else {
            // 사용자 정보를 가져오는 API 요청
            axios.post(process.env.REACT_APP_BACK_HOST_URL +"/api/getUserByNo", { token: token })
                .then(res => {
                    // console.log(res);
                    if (res.data) {
                        setUserInfo({
                            user_nick: res.data.user_nick,
                            user_email: res.data.user_email,
                            user_id: res.data.user_id,
                            user_pwd: res.data.user_pwd,
                            user_no: res.data.user_no,
                            provider: res.data.provider // provider 값 설정
                        });
                    } else {
                        alert("사용자 정보를 가져오는 데 실패했습니다.");
                    }
                })
                .catch(() => {
                    alert("사용자 정보를 가져오는 데 실패했습니다.");
                });
        }
    }, [navigate, cookies.token]);

    const handleNickCheck = () => {
        const userNick = userInfo.user_nick;
        const token = cookies.token;

        axios.post(process.env.REACT_APP_BACK_HOST_URL +"/api/getUserByNo", { token: token }) 
            .then(res => {
                if (res.data.user_nick === userNick) {
                    setIsNickChecked(true);
                    alert("현재 사용 중인 닉네임이 맞으면 확인 버튼을 눌러주세요.");
                } else {
                    // 닉네임 중복 체크
                    axios.post(process.env.REACT_APP_BACK_HOST_URL +"/api/checkUserNick", { nick: userNick })
                        .then(res => {
                            if (res.data.exists) {
                                alert("이미 다른 회원이 사용 중인 닉네임입니다.");
                                setIsNickChecked(false);
                            } else {
                                setIsNickChecked(true);
                                alert("사용 가능한 닉네임입니다.");
                            }
                        })
                        .catch(() => {
                            alert("닉네임 중복 확인 중 오류가 발생했습니다.");
                        });
                }
            })
            .catch(() => {
                alert("사용자 정보를 가져오는 데 실패했습니다.");
            });
    };

    // 회원정보 수정
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isNickChecked) {
            alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        const params = {
            user_no: userInfo.user_no !== null ? userInfo.user_no : 0,
            user_id: userInfo.user_id,
            user_pwd: userInfo.user_pwd,
            user_email: userInfo.user_email,
            user_nick: userInfo.user_nick
        };
        
        axios.post(process.env.REACT_APP_BACK_HOST_URL +"/api/edit", params)
        .then(res => {
            if (res.data.status) {
                setCookie("user_nick", res.data.user_nick); // 수정된 부분
                setIsLoggedIn(true);
                alert("수정이 완료되었습니다.");
            } else {
                alert("유효한 사용자가 아닙니다.");
            }
        })
        .catch(() => {
            alert("수정에 실패했습니다.");
        });
    };

    // 회원탈퇴
    const handledelete = (e) => {
        e.preventDefault();
        
        const user_nick = cookies.user_nick; 
        
        axios.post(process.env.REACT_APP_BACK_HOST_URL +'/api/userdelete', { user_nick })
        .then((response) => {
            console.log(response.data); 
            alert('회원탈퇴 완료');
            navigate('/signup'); // 탈퇴 후 signup 페이지로 이동            
            logout(); // 로그아웃 처리
        })
        .catch((err) => {
            console.error(err.response.data);  
            setError('탈퇴 중 오류가 발생했습니다.');
        });
    };

    // provider가 kakao 또는 naver인지 체크
    const isProviderDisabled = cookies.provider === 'kakao' || cookies.provider === 'naver';
    const goToMainEvent = () => navigate('/');
    const isValueNull = v =>  v == null ? "" : v;

    return (
        <div className="signup-container" id="update">
            <h2>회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="user_nick">닉네임</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="user_nick"
                            value={userInfo.user_nick}
                            onChange={(e) => setUserInfo({ ...userInfo, user_nick: e.target.value })}
                            placeholder="닉네임을 입력해 주세요."
                            required
                        />
                        <button type="button" className="check-btn" onClick={handleNickCheck}>중복 확인</button>
                    </div>
                    <span className="info">(영문 대소문자, 숫자 포함 4자 - 16자)</span>
                </div>

                <div className="form-group">
                    <label htmlFor="user_id">아이디</label>
                    <div className="input-group">
                        <input
                            type="text"
                            id="user_id"
                            value={userInfo.user_id}
                            onChange={(e) => setUserInfo({ ...userInfo, user_id: e.target.value })}
                            placeholder="아이디를 입력해 주세요."
                            disabled // provider가 kakao 또는 naver일 경우 비활성화
                        />
                        <button type="button" className="check-btn" disabled>중복 확인</button>
                    </div>
                    <span className="info">(영문 대소문자, 숫자 포함 4자 - 16자)</span>
                </div>

                <div className="form-group">
                    <label htmlFor="user_pwd">비밀번호</label>
                    <input
                        type="password"
                        id="user_pwd"
                        value={isValueNull(userInfo.user_pwd)}
                        onChange={(e) => setUserInfo({ ...userInfo, user_pwd: e.target.value })}
                        placeholder="비밀번호를 입력해 주세요."
                        required
                        disabled={isProviderDisabled} // provider가 kakao 또는 naver일 경우 비활성화
                    />
                    <span className="info">(영문 대소문자, 숫자 포함 4자 - 16자)</span>
                </div>

                <div className="form-group">
                    <label htmlFor="user_email">이메일</label>
                    <input
                        type="email"
                        id="user_email"
                        value={isValueNull(userInfo.user_email)}
                        onChange={(e) => setUserInfo({ ...userInfo, user_email: e.target.value })}
                        placeholder="이메일을 입력해 주세요."
                        required
                        disabled={isProviderDisabled} // provider가 kakao 또는 naver일 경우 비활성화
                    />
                </div>					
                <div className='update'>
                    <button type="submit">수정완료</button>
                    <button type='button' onClick={handledelete}>회원탈퇴</button>
                </div>
                <button className="btn_line" onClick={goToMainEvent}>메인으로</button>
            </form>
        </div>
    );
};

export default Userinfo;
