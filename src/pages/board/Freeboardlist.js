import React, { useEffect, useState } from 'react';
import '../../assets/css/khboard.css';
import khboard from '../../assets/img/khboard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import main from '../../assets/img/main';
import { useCookies } from 'react-cookie';

//카테고리
import { Link } from 'react-router-dom';


function Freeboardlist() {
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [paging, setPaging] = useState([]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [cookie, setCookie] = useCookies();
    const board_type = 2;

    //카테고리
    const [categories, setCategories] = useState([]);
    const {category_id} = useParams();
    console.log("free categories", category_id);

    // 랭킹관련 (무료나눔에는 없음)
    const [ranks, setRanks] = useState([]);
    const {file_no} = useParams();

    const getImgUrl = file_no => {
        if(file_no === undefined){
            return main.main_bg;
        }
        return process.env.REACT_APP_BACK_HOST_URL + '/view?file_no=' + file_no;
    }
    // console.log("file_no: {}", file_no);
    // console.log("getImgUrl: {}", getImgUrl);

    useEffect(()=>{
        axios.post(process.env.REACT_APP_BACK_HOST_URL + "/boardlist", {query, page, size, category_id, board_type})
        .then(res=> {
            console.log(res);
            if(res.data.state) {
                const { ranks: rankData, list: listData } = res.data.result;
                setRanks(res.data.result.ranks);
                //setList(res.data.result.list);
                setList(listData || []);
                setPaging(res.data.result.paging);
                setTotal(res.data.result.total);
                setCategories(res.data.result.categories);
            } else {
                
            }
        })
        .catch(error=>console.log(error));
    }, [query, page, category_id]);
    
    const submitEvent = e => {
        e.preventDefault();
        setQuery(e.target.search.value);
    }

    const pagingEvent = index => {
        setPage(index);
    }

    const pagingStep = type => {
        if(type) {
            // 1 증가
            if(Math.floor( total / size ) > page)  setPage(page + 1);
        } else {
            // 1 감소
            if(page > 0) setPage(page - 1);
        }
    }

    const addEvent = (e) => {
        e.preventDefault();
        if(cookie.token == null){
            alert("로그인한 회원만 글 작성이 가능합니다.");
            navigate("/login");
        } else {
            navigate("/freeboardadd");
        }
    }

    const clickEvent = (board_no) => {
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boardaddcount/${board_no}`)
         .then(res=> {
            if(res.data.state) {
                navigate(`/freeboarddetail/${board_no}`);
            }
        })
         .catch(error=>console.log(error));
    }

    return (
        <main>
            <section className="section khsection">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <h1 className="sub_title">식물 무료 나눔</h1>
                            <a href="#" onClick={e => addEvent(e)} className="list_btn">등록</a>
                            <div className="search">
                                <form onSubmit={submitEvent}>
                                    <input type="text" name="search" className="search_input" />
                                    <input type="submit" value="조회" className="search_btn" />
                                </form>
                            </div>
                            
                            <ul className="filter_list">
                                <li className={category_id == undefined ? 'active' : ''}><a href='/freeboardlist'>전체</a></li>
                                {categories?.map (cate => {
                                    return (
                                        <li key={cate.category_id} className={ Number(category_id) === cate.category_id ? 'active' : ''}>
                                            <Link to={`/freeboardlist/${cate.category_id}`}>{cate.category_name}</Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            
                            <table className="sub_table knowhow">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>제목</th>
                                        <th>작성자</th>
                                        <th>작성일</th>
                                        <th>조회수</th>
                                        <th>좋아요</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list.map((v, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{v.board_no}</td>
                                                    <td onClick={() => clickEvent(v.board_no)} style={{cursor: 'pointer'}}><span className="filter">[{v.category_name}]</span> {v.board_title}</td>                                                    
                                                    <td>{v.user_nick}</td>
                                                    <td>{v.board_regdate2}</td>
                                                    <td>{v.board_count}</td>
                                                    <td>{v.board_like}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {/* HTML로 pagination */}
                            <ul className="pagination">
                                <li onClick={()=>pagingStep(false)}><ChevronLeft className="bi bi-chevron-left"></ChevronLeft></li>
                                {
                                    paging?.map((v,i) => {
                                        return (
                                            <li className={v == page ? 'active' : ''} onClick={()=>pagingEvent(v)} key={i}>{v + 1}</li>            
                                        )
                                    })
                                }
                                <li onClick={()=>pagingStep(true)}><ChevronRight className="bi bi-chevron-right"></ChevronRight></li>
                            </ul>
                        </div>	
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Freeboardlist;