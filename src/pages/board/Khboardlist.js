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

function Khboardlist() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);
    const [paging, setPaging] = useState([]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [cookie, setCookie] = useCookies();
    const board_type = 1;
    
    //카테고리
    const [categories, setCategories] = useState([]);
    const {category_id} = useParams();
    console.log(category_id);

    // 랭킹관련
    const [ranks, setRanks] = useState([]);
    const {file_no} = useParams();

    const getImgUrl = file_no => {
        if(file_no === undefined){
            return main.main_bg;
        }
        return process.env.REACT_APP_BACK_HOST_URL + '/view?file_no=' + file_no;
    }
    console.log("file_no: {}", file_no);
    console.log("getImgUrl: {}", getImgUrl);

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
                // console.log(res.data.result.categories);
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
            navigate("/khboardadd");
        }
    }

    const clickEvent = (board_no) => {
        axios.post(`${process.env.REACT_APP_BACK_HOST_URL}/boardaddcount/${board_no}`)
         .then(res=> {
            if(res.data.state) {
                navigate(`/khboarddetail/${board_no}`);
            }
        })
         .catch(error=>console.log(error));
    }

    return (
        <main>
            <section className="section box-body">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <h1 className="sub_title">식물 키우기 노하우</h1>
                    
                            <div className="site-section slider-rank-wrap">
                                <Swiper className='swiper init-swiper'
                                    modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
                                    loop={true} // 무한 루프 활성화
                                    autoplay={{
                                        delay: 0,
                                        pauseOnMouseEnter: true, // added
                                        disableOnInteraction: false,
                                    }}
                                    speed={3000} //add
                                    spaceBetween={30}
                                    slidesPerView={4}
                                    onSlideChange={() => console.log('slide change')}
                                    onSwiper={(swiper) => console.log(swiper)}
                                    navigation
                                    breakpoints={{
                                        // 스마트폰 화면 크기
                                        320: {
                                        slidesPerView: 1,
                                        spaceBetween: 40,
                                        },
                                        // 태블릿 화면 크기
                                        768: {
                                        slidesPerView: 2,
                                        spaceBetween: 40,
                                        },
                                        // 데스크톱 화면 크기
                                        1200: {
                                        slidesPerView: 4,
                                        spaceBetween: 20,
                                        },
                                    }}
                                >
                                    {ranks.map((board, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="swiper-slide">
                                                <a href={`/khboarddetail/${board.board_no}`} className="slide_link">
                                                    <div className="box">
                                                        <div className='khboard_rank'>
                                                            <img className="plantimg"
                                                                src={board?.file_no == 0 ? getImgUrl() : getImgUrl(board?.file_no)} 
                                                                alt={`ranks${index + 1}`} />
                                                        </div>
                                                        <span className="plantrank">{index + 1}위</span>
                                                        <div>
                                                            <div>
                                                                <p className="plantname">[{board.category_name}] {board.board_title.substring(0, 20)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="plantdetail">{board.board_content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </SwiperSlide>
                                    ))}                                    
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div> 		
            </section>
        
            <section className="section khsection">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <a href="#" onClick={e=> addEvent(e)} className="list_btn">등록</a>
                            <div className="search">
                                <form onSubmit={submitEvent}>
                                    <input type="text" name="search" className="search_input" />
                                    <input type="submit" value="조회" className="search_btn" />
                                </form>
                            </div>
                            
                            <ul className="filter_list">
                                <li className={category_id == undefined ? 'active' : ''}><a href="/khboardlist">전체</a></li>
                                {categories?.map (cate => {
                                    return (
                                        <li key={cate.category_id} className={ Number(category_id) === cate.category_id ? 'active' : ''}>
                                            <Link to={`/khboardlist/${cate.category_id}`}>{cate.category_name}</Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            
                            <table className="sub_table knowhow">                                
                                <colgroup>
                                    <col width="5%" />
                                    <col width="40%" />
                                    <col width="15%" />
                                    <col width="20%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
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

export default Khboardlist;