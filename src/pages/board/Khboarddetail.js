import { useEffect, useRef, useState } from 'react';
import '../../assets/css/khboard.css';
import khboard from '../../assets/img/khboard';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import main from '../../assets/img/main';

import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";


const KhboardComment = ({v, f}) => {
    const [comment, setComment] = useState(v);
    const [cookie, setCookie] = useCookies();
    const [isShow, setIsShow] = useState(true);
    const [array, setArray] = useState([]);

    useEffect(()=> {
        setArray( comment.comment_content.split('\n') );
    }, [comment]);
    
    const updateEvent = () => {
        setIsShow(!isShow);
    }

    const submitEvent = e => {
        e.preventDefault();
        // 비동기 통신
        const params = {comment_no: comment.comment_no, comment_content: e.target.comment_content.value}
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boarddetail/comment/update`, params, {headers: {'Authorization': cookie.token}})
        .then(res => {
            if(res.data.state) {
                setComment(res.data.result);
                updateEvent();
            } else {
                alert(res.data.result);
            }
        }).catch(err => {
            console.log('댓글 수정 중 오류가 발생하였습니다: {}', err);
        });
    }

    // 댓글 삭제
    const deleteEvent = () => {
        // 비동기 통신
        const params = {comment_no: comment.comment_no}
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boarddetail/comment/delete`, params, {headers: {'Authorization': cookie.token}})
        .then(res => {
            if(res.data.state) {
                f();
                alert("댓글이 삭제되었습니다.")
            } else {
                alert(res.data.result);
            }
        }).catch(err => {
            console.log('댓글 삭제 중 오류가 발생하였습니다: {}', err);
        });
    }
    return (
        <>
            {
                isShow ?
                <div className='reply_box' style={{borderBottom: '1px solid #0e775f', padding: '20px 20px 10px', justifyContent: 'space-between'}}>
                    <div>
                        <div style={{fontWeight: '600', fontSize: '15px'}}>{comment.user_nick}</div>
                        {
                            array?.map((v,i) => <div key={i}>{v}</div>)
                        }
                        {/* <div>{comment.comment_content}</div> */}
                    </div>
                    <div>
                        <span className="detail_reg">{comment.comment_moddate} </span>
                    {
                        cookie.user_nick === comment.user_nick ?
                        <div style={{float: 'right', display: 'flex', gap: '10px'}}>
                            <span className='comment_style' type='button' onClick={updateEvent}>수정</span>
                            <span className='comment_style' type='button' onClick={deleteEvent}>삭제</span>
                        </div>
                        : <></>
                    }
                    </div>
                </div>
                :
                <div className='comment_writer'>
                    <form onSubmit={submitEvent}>
                        <p>{comment.user_nick}</p>
                        <textarea name="comment_content" className='comment_wirter' type='text' defaultValue={comment.comment_content} />
                        <button type='button' onClick={updateEvent}>취소</button>
                        <button type='submit'>수정</button>
                    </form>
                </div>
            }
        </>
        
    )
}


function Khboarddetail() {
    
    // 윤은씨 및 강사님이 확인해주신 코드(10월10일)
    const {board_no} = useParams();
    const [khBoard, setKhBoard] = useState(null);
    const [khBoardDetail, setKhBoardDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cookie, setCookie] = useCookies();
    const [board_like, setBoard_like] = useState(0); // 기본값 0
    const [heartImg, setHeartImg] = useState(khboard.main.img_02); //초기 이미지 빈 하트 이미지로 설정

    const navigate = useNavigate();

    //댓글 부분(GPT)
    const [comments, setComments] = useState([]);
    const ref_nickname = useRef();
    const ref_comment = useRef();

    
    //파일 불러오는 부분
    const getImgUrl = file_no => {
        return process.env.REACT_APP_BACK_HOST_URL + '/view?file_no=' + file_no + "&q=" + Math.random();
    }

    useEffect(() => {
        getData();
    }, [board_no]);

    const getData = () => {
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boarddetail/${board_no}`, {}, { headers: {'Authorization': cookie.token} })
            .then(res=> {
                if(res.data.state) {
                    console.log(res);
                    setKhBoard(res.data.result.khBoard);
                    setKhBoardDetail(res.data.result.board);
                    setBoard_like(res.data.result.board.board_like); // 초기 좋아요 수 설정

                    setHeartImg((res.data.result.like == null) ? khboard.main.img_02 : khboard.main.img_06);
                    //setHeartImg(prevImg => prevImg === khboard.main.img_02 ? khboard.main.img_06 : khboard.main.img_02);

                    console.log("khboard" + " 데이터 상태확인용 ( " + res.data.result.khboard + " ) ");
                    setComments(res.data.result.comments); // 댓글 목록 가져옴
                } else {
                    console.log("실패" + res.data.result);
                    setError(res.data.result);
                }
            })
            .catch(error => {
                console.log("에러" + error);
            });
    }
    
    if (error) return <div> {error} </div>;
    
    // //파일 불러오는 부분(위에 있음 중복코드 일단 주석처리)
    // const getImgUrl = file_no => {
    //     return process.env.REACT_APP_BACK_HOST_URL + '/view?file_no=' + file_no;
    // };

    //댓글 추가
    const handleaddComment = (e) => {
        e.preventDefault();
        let comment_content = ref_comment.current.value;
        // let user_nick = ref_nickname.current.ref;
        
        if (!comment_content) {
            alert('댓글을 입력해주세요!');
            return;
        }

        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boarddetail/comment/add`, {comment_content, board_no}, {headers: {'Authorization': cookie.token}})
        .then(res => {
            if(res.data.state) {
                setComments(res.data.result);
                console.log(res.data.msg);
                ref_comment.current.value = '';
            } else {
                alert(res.data.result);
            }
        }).catch(err => {
            console.log('댓글 등록 중 오류가 발생하였습니다: {}', err);
        });
    };

    // 게시글 삭제
    const deleteBoard = () => {
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boarddelete/${board_no}`, {}, {
                    headers: {
                        Authorization: cookie.token,
                    },
                })
                .then(res => {
                    if (res.data.state) {
                        alert("게시글이 삭제되었습니다.");
                        // 삭제후 게시판 목록으로 이동
                        navigate('/khboardlist'); 
                    } else {
                        alert("본인의 글만 삭제 가능합니다.");
                    }
                })
                .catch(error => {
                    console.error("삭제 중 오류 발생:", error);
                    alert("오류가 발생했습니다.");
                });
            }

    // 이미지 클릭 시 좋아요 추가
    const imageClick = () => {
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boardaddlike/${board_no}`, {}, {
            headers: {
                Authorization: cookie.token,
            },
        })
        .then(res => {
            if (res.data.state) {
                //alert("좋아요를 눌렀어요!");
                setBoard_like(res.data.result);
                setHeartImg(prevImg => prevImg === khboard.main.img_02 ? khboard.main.img_06 : khboard.main.img_02);
            } else {
                alert("로그인 상태를 확인해 주세요.");
            }
        })
        .catch(error => {
            console.error("좋아요 등록 중 오류 발생:", error);
            alert("오류가 발생했습니다.");
        });
    };
    const updateBoard = () => {
        if(khBoardDetail.user_nick === cookie.user_nick) {
            navigate(`/khboardupdate/${board_no}`);
        }else {
            alert("본인의 글만 수정 가능합니다.");
        }
    }
    return (
    <main>
        <section className="section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-sm-12">
                        <h1 className="sub_title">식물 키우기 노하우</h1>
                            <table className="detail_table">
                                <thead>
                                    <tr>
                                    <td>
                                        <span>[{khBoardDetail?.category_name}] </span><span>{khBoardDetail?.board_title}</span> 
                                        <p>{khBoardDetail?.user_nick} | {khBoardDetail?.board_regdate}</p>
                                        <p className="f_right">조회수 {khBoardDetail?.board_count} | 좋아요 {board_like}</p>                      
                                    </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>
                                        {khBoardDetail?.board_content}
                                        <p style={{textAlign: 'center'}}><img src={khBoardDetail?.file_no == 0 ? main.main_bg : getImgUrl(khBoardDetail?.file_no)} alt='img_01' /></p>
                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-center mt-5">
                        <button type="button" className="btn_primary" onClick={updateBoard}>수정</button>
                        <button type="button" className="btn_primary btn_delete" onClick={deleteBoard}>삭제</button>
                        <a href="/khboardlist" className="btn_primary btn_cancle">목록</a>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 ol-sm-12">
                            {/* <div className="detail_comment">댓글 3</div> */}
                            <div className="detail_like">
                                    <img src={heartImg} alt='heartImg' 
                                    onClick={imageClick} 
                                    style={{ cursor: 'pointer', marginBottom: '7px'}}
                                    />
                                    <span>좋아요 {board_like}</span>
                                    {/* <button onClick={khboardaddlike}>좋아요 {board_like}</button> */}
                            </div>
                        </div>
                        <div className="col-md-12 ol-sm-12" style={{backgroundColor: '#f3f3f3'}}>
                        {/* 댓글 창 */}
                            <div className="reply_box">

                            <div style={{padding: '20px 20px'}}>
                                {comments?.map((v, i) => <KhboardComment v={v} key={i} f={getData}/>)}
                            </div>

                            <div className='comment_writer'>
                                <form onSubmit={handleaddComment}>
                                    <p>{cookie?.user_nick}</p>
                                    <textarea className='comment_wirter' type='text' ref={ref_comment} placeholder='댓글을 입력해 주세요' />
                                    <button type='submit'>등록</button>
                                </form>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>            
            </section>    
        </main>
    );
}

export default Khboarddetail;