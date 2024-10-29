import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { ArrowRight } from 'react-bootstrap-icons';
import main from './assets/img/main';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

//2024. 10. 18. ----
import axios from 'axios';
import { useParams } from 'react-router-dom';

function App() {

    //2024. 10. 18. ----
    const [ranks, setRanks] = useState([]);
    const [list, setList] = useState([]);
    const [freeranks, setFreeRanks] = useState([]);
    const { file_no } = useParams();

    const getImgUrl = file_no => {
        if(file_no === undefined) {
            return main.main_bg;
        }
        return process.env.REACT_APP_BACK_HOST_URL + '/view?file_no=' + file_no;
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACK_HOST_URL + "/")
            .then(res => {
                console.log("가져온 데이터 확인 >>> ", res);
                if(res.data.state) {
                    setList(res.data.result.list);
                    setRanks(res.data.result.ranks);
                    setFreeRanks(res.data.result.freeranks);
                } else {
                    console.log('데이터 불러오기 실패');
                }
            })
            .catch(error => console.log("랭킹을 불러오는 데 오류가 발생하였습니다. ", error));
    }, []);

    return (
        <main>
            {/* 메인 비주얼 Section */}
            <section id="main" className="main section">
                <div className="container">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6 mb-5 mb-lg-0 order-lg-2 d-none d-sm-block" data-aos="fade-up" data-aos-delay="400">
                            <img src={main.login_calendar} alt="login_calendar" />
                        </div>
                        <div className="col-lg-5 order-lg-1 offset-md-1">
                            <span className="section-subtitle" data-aos="fade-up">식집사 알리미</span>
                            <h1 className="mb-4" data-aos="fade-up">
                                <span className="pt_color">나를 위한</span><br />반려 식물 찾기
                            </h1>
                            <p className="mt-5" data-aos="fade-up">
                                <a href="/plantMine" className="btn btn-get-started">찾으러 가기</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* 아이콘 Section */}
            <section className="icon_section section">
                <div className="container">
                    <div className="content">
                        <ul className="icon">
                            <li>
                                <a href="/plantMine">
                                    <img src={main.main_icon_01} alt="icon_01" />              
                                </a>
                                <p>식물 찾기</p>
                            </li>
                            <li>
                                <a href="/freeboardlist">
                                    <img src={main.main_icon_02} alt="icon_02" />
                                </a>
                                <p>무료 나눔</p>
                            </li>
                            <li>
                                <a href="/khboardlist">
                                    <img src={main.main_icon_03} alt="icon_03" />
                                </a>
                                <p>나만의 노하우</p>
                            </li>
                            <li>
                                <a href="/hotellist">
                                    <img src={main.main_icon_04} alt="icon_04" />
                                </a>
                                <p>돌봄 호텔 찾기</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 오늘의 식물 section */}
            <section id="today" className="main_today today section">
                <div className="site-section slider-today-wrap">
                    <h1>오늘의 식물</h1>
                    <img src={main.slide_bg_point} alt="slide_bg_point" className="slide_bg_point" />

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
                        {/* 참고링크 https://multifidus.tistory.com/182 */}
                        <>
                        {ranks && ranks.map((board) => (
                            <SwiperSlide key={board.id}>
                                <div className="swiper-slide">
                                    <a href={`/khboarddetail/${board.board_no}`} className="slide_link">
                                        <div className="today">
                                            <h3>{board?.board_title.substring(0, 10)}</h3>
                                            <p className="content">{board?.board_content}</p>
                                            <span className="d-block position">{board?.board_regdate}</span>
                                            <div className='rankimg'>
                                                <img  src={board?.file_no === 0 ? getImgUrl() : getImgUrl(board?.file_no)} alt={`khranks${board.id + 1}`} />
                                            </div>
                                            <p className="mb-0 more dark">
                                                자세히보기 <ArrowRight className="bi bi-arrow-right-short" />
                                            </p>
                                        </div>
                                    </a>
                                </div>
                            </SwiperSlide>
                        ))}      
                        </>
                    </Swiper>
                </div>
            </section>

            {/* 식물무료나눔 section */}
            <section id="free" className="free section">
                <div className="container section-title" data-aos="fade-up">
                    <h1>식물 무료 나눔</h1>
                </div>
                <div className="container" data-aos="fade-up">
                    <div className="swiper-wrapper">
                        <Swiper className='swiper init-swiper'                  
                            modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
                            loop={false} // 무한 루프 활성화
                            autoplay={{
                                delay: 500,
                                pauseOnMouseEnter: false, // added
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
                        <>
                            {freeranks && freeranks.map((board) => (
                                <SwiperSlide key={board.id}>
                                    <div className="swiper-slide">
                                        <a href={`/freeboarddetail/${board.board_no}`} className="slide_link">
                                            <div className="swiper-slide">
                                                <div className="free_box mx-auto">
                                                    <h6>{board?.category_name}</h6>  
                                                    <h3>{board?.board_title.substring(0, 10)}</h3>
                                                    <p style={{height: '60px', overflow: 'hidden'}}>{board?.board_content.substring(0, 25)}</p>
                                                </div>
                                                <a href="/" className="free_more">보러가기</a>
                                            </div>
                                        </a>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </> 
                        </Swiper>
                    </div>                    
                </div>
            </section>
            
            {/* 가입 Section */}
            <section id="join" className="join section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-sm-6 ">
                            <h1>지금 회원 가입을 하면 Plantler만의<br />다양한 서비스를 경험할 수 있어요!</h1>
                            <p>사랑스러운 나의 식물을 위한 식집사가 되어주세요 :)</p>
                            <ul className="hashtag">
                                <li><a href="/">#식집사</a></li>
                                <li><a href="/">#반려식물</a></li>
                                <li><a href="/">#화분키우기</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <img src={main.join_point} alt="join_point" className="join_point" />
                        </div>                    
                    </div>
                </div>
            </section>
        </main>
    );
}

export default App;
