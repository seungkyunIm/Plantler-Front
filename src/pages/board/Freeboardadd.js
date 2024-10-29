import React, { useRef, useState } from "react";
import '../../assets/css/khboard.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";



function Freeboardadd() {
    const check = true;
    const ref_title = useRef();
    const ref_content = useRef();
    const ref_file = useRef();
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();
    const board_type = 2;
    
    //글자 수 상태관리
    const maxLength = 100;

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
        
        let formData = new FormData();
        if(ref_file.current.files.length > 0) {
            for(let file of ref_file.current.files) {
                formData.append("file", file);
            }
        } else {
            console.log("NO FILE SELECTED")
        }
        formData.append("board_title", board_title);
        formData.append("board_content", board_content);
        formData.append("category_id", category_id);
        formData.append("board_type", board_type);

        axios.post( process.env.REACT_APP_BACK_HOST_URL + "/boardadd", formData, { headers: {'Authorization': cookie.token, 'Content-Type': 'multipart/form-data'} })
            .then(res=>{
                console.log(res);
                if(res.data.state) {
                    navigate ("/freeboardlist");
                }
            })
            .catch(error=>console.log(error));
    }    

    return(
        <main>
                <section className="section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-sm-12">
                                <h1 className="sub_title">식물 무료 나눔 게시판 글쓰기</h1>						
                                
                                <table className="sub_table add">
                                    <tbody>
                                        <tr>
                                            <th>제목</th>
                                            <td><input type="text" placeholder="제목을 입력해주세요." ref={ref_title}/></td>
                                        </tr>
                                        <tr>
                                            <th>내용</th>
                                            <td><textarea rows="5" maxLength={maxLength} placeholder="내용을 입력해주세요." ref={ref_content}></textarea></td>
                                        </tr>
                                        <tr>
                                            <th>분류</th>
                                            <td>
                                                <input type="radio" id="part_1" name="part" value="100" defaultChecked={check}/> <label htmlFor="part_1">이사/환경변화</label>
                                                <input type="radio" id="part_2" name="part" value="101" /> <label htmlFor="part_2">건강문제</label>
                                                <input type="radio" id="part_3" name="part" value="102" /> <label htmlFor="part_3">식물나눔</label>
                                                <input type="radio" id="part_4" name="part" value="103" /> <label htmlFor="part_4">기타</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>파일첨부</th>
                                            <td><input type="file" className="input_file" ref={ref_file} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="text-center mt-5">
                                    <a href="/freeboardlist" className="btn_primary btn_cancle">취소</a>
                                    <button type="button" className="btn_primary btn_add" onClick={submitEvent}>등록</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

    );

}

export default Freeboardadd;
