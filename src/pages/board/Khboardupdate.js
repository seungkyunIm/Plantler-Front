import React, { useEffect, useRef, useState } from "react";
import '../../assets/css/khboard.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from "react-router-dom";
import {useAuth} from '../login/AuthContext';

function Khboardupdate() {
    const {historyBack} = useAuth();
    const check = true; // 이렇게 해줘야 등록된 게시물의 카테고리가 상세페이지에 선택되어짐
    const {board_no} = useParams();
    const ref_title = useRef();
    const ref_content = useRef();
    const ref_file = useRef();
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [boardUpdate, setBoardUpdate] = useState({
        title: '',
        content: '',
        category_id: '0'
    });
    useEffect(()=> {
        ref_title.current.value = boardUpdate.board_title;
        ref_content.current.value = boardUpdate.board_content;
        
        // 선택된 카테고리 설정
        document.getElementsByName("part").forEach((input) => {
            if (input.value === boardUpdate.category_id.toString()) {
                input.checked = true;
            }
        });
    }, [boardUpdate]);
    
    useEffect(() =>{
        // 기존 게시물 데이터 가져오기
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boarddetail/${board_no}`, {}, { headers: {'Authorization': cookie.token} })
        .then(res=> {
            if(res.data.state && cookie.user_nick === res.data.result.board.user_nick && res.data.result.grant) {
                setBoardUpdate(res.data.result.board);
            } else {
                historyBack();
            }
        })
        .catch(error => {
            console.log("에러" + error);
        });
    }, []);

    if (error) return <div> {error} </div>;
    const getImgUrl = file_no => {
        return process.env.REACT_APP_BACK_HOST_URL + '/view?file_no=' + file_no;
    }


    const submitEvent = () => {
        let board_title = ref_title.current.value;
        let board_content = ref_content.current.value;
        let category_id = 0;
        let e1 = document.getElementsByName("part");
        for(let e of e1) {
            if(e.checked) {
                category_id = e.value;
                //category_id = parseInt(e.value); // 문자열을 정수로 변환
                break;
            }
        }
        // 게시글 수정 후 게시판 리스트로
        //navigate ("/khboardlist");
        
        let formData = new FormData();
        if(ref_file.current.files.length > 0) {
            for(let file of ref_file.current.files) {
                formData.append("file", file);
            }
        } else {
            console.log("NO FILE SELECTED")
        }
        // formData.append("file", files);
        formData.append("board_no", board_no); // 수정할 게시물 번호 추가
        formData.append("board_title", board_title);
        formData.append("board_content", board_content);
        formData.append("category_id", category_id);

        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boardupdate`, formData, { headers: {'Authorization': cookie.token, 'Content-Type': 'multipart/form-data'} })
            .then(res=>{
                if(res.data.state) {
                    navigate("/khboarddetail/" + board_no);
                }
            })
            .catch(error=>console.log(error));

    }

    // 인풋값 변경
    const changeEvent = e => {
        const {name, value} = e.target;
        setBoardUpdate({...boardUpdate, [name]:value});
    }
    

    return(
        <main>
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <h1 className="sub_title">식물 키우기 노하우 게시판 수정</h1>						
                                
                                <table className="sub_table add">
                                    <tbody>
                                        <tr>
                                            <th>제목</th>
                                            <td><input type="text" placeholder="제목을 입력해주세요." name="board_title" value={boardUpdate.board_title} onChange={changeEvent} ref={ref_title} /></td>
                                        </tr>
                                        <tr>
                                            <th>내용</th>
                                            {/* <td><textarea rows="10" placeholder="내용을 입력해주세요." value={boardUpdate?.board_content} ref={ref_content}></textarea></td> */}
                                            <td><textarea rows="10" placeholder="내용을 입력해주세요." name="board_content" value={boardUpdate.board_content} onChange={changeEvent} ref={ref_content}></textarea></td>
                                        </tr>
                                        <tr>
                                            <th>분류</th>
                                            <td>
                                                <input type="radio" id="part_1" name="part" value="1" defaultChecked={check} /> <label htmlFor="part_1">꽃</label>
                                                <input type="radio" id="part_2" name="part" value="2" /> <label htmlFor="part_2">열매</label>
                                                <input type="radio" id="part_3" name="part" value="3" /> <label htmlFor="part_3">실내</label>
                                                <input type="radio" id="part_4" name="part" value="4" /> <label htmlFor="part_4">실외</label>
                                                <input type="radio" id="part_5" name="part" value="5" /> <label htmlFor="part_5">공기정화</label>
												<input type="radio" id="part_6" name="part" value="6" /> <label htmlFor="part_6">기타</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>파일첨부</th>
                                            <td><input type="file" className="input_file" ref={ref_file} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="text-center mt-5">
                                    <button type="button" className="btn_primary" onClick={submitEvent}>수정</button>							
                                    <a href="/khboardlist" className="btn_primary btn_cancle">취소</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

    );

}

export default Khboardupdate;
