import React from 'react';
import { useState, useEffect } from 'react';
import hotel from '../../assets/img/hotel';
import '../../assets/css/hotelmain.css';
import '../../assets/css/main.css';


function Hotellist() {
const textAlign = {margin: '0 auto'};
    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="row align-items-center justify-content-between">
                        <div className="sec"> 
                            <div className="txt-cont">
                                <img src={hotel.logo_icon} alt="logo_icon" width={"61px"} height={"76px"} style={textAlign} />
                                <p className="hotel01">잠시 집을 비운 사이,<br /> 반려 식물을 맡길 곳이 필요하다면?</p>
                                <br />
                                <p><span className="hotel02">식물 돌봄 호텔</span>을 이용해 보세요!</p>
                                <br />
                                <p className="hotel03"><strong>🌿 식물 돌봄 호텔 🌿</strong>
                                    <br />여행이나 출장으로 오랜 기간 집을 비울 때 나를 대신해 반려 식물을 케어해 주는 곳!
                                    <br />전문적인 관리와 따뜻한 사랑으로, 식물들이 편안하게 지낼 수 있도록 서비스를 제공해 주는 곳!</p>
                                <p className="hotel04"><strong>🌟 서비스 특징 🌟</strong>
                                    <br />맞춤형 물주기 및 영양 공급
                                    <br />전문적인 해충 관리 및 건강 체크
                                    <br />최적의 햇볕 조절과 환경 제공
                                    <br />24시간 모니터링으로 안심 보장</p>
                                <br />
                                <a href="./hotelmaps">
                                    <span className="block09">식물 돌봄 호텔 살펴보기 클릭</span>
                                </a>
                            </div>         
                        </div>
                    </div>
                </div>
            </section>
        </main>

    );
}

export default Hotellist;