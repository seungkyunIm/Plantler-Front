import hotel from "../../assets/img/hotel";
import '../../assets/css/hotelmain.css';
import '../../assets/css/main.css';
import React, { useState, useEffect, useRef} from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";  //npm에서 가져온 pkg


const getLocation = () => {     //kakaomap 초기 데이터: 추후 식물호텔 데이터 추가 시 이 내용만 수정하면 됨
    return {lat: 0, lng: 0};
}
const getMap = () => {      //kakaomap 크기 및 확대•축소 정도 (고정): 추후 식물호텔 데이터 추가되어도 return 쪽에 코드 기입할 필요 없음
    return { 
        style: { width: "100%", height: "400px" },
        level: 2
    };
}

function Hotelmaps() {
    const { kakao } = window;
    const [loading, error] = useKakaoLoader({
        appkey: process.env.REACT_APP_KAKAO_MAP_APP_KEY, 
        libraries: ["clusterer", "drawing", "services"]
    }); //Kakaomap APP KEY 암호화 후 로딩
    const [kakaoLocation, setKakaoLocation] = useState(() => getLocation());    //Kakaomap 위치 조정 활용
    const [kakaoMap, setKakaoMap] = useState(() => getMap());   //Kakaomap 가져오기
    useEffect(() => {
        
        if(kakao !== undefined) {
            var geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch('경기 광명시 양지로 17', (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setKakaoLocation({lat: result[0].y, lng:result[0].x});
                }
            }); 
        }

        // 그냥 쓰는 중 ..↓↓↓
        // const mapLocation = {lat: 37.41856141165251, lng: 126.88285319271307};
        // 추후 데이터 베이스 활용 시 호텔 리스트 데이터를 axios로 호출하여 이용할 부분
        //kakaomap 호출
        // setKakaoLocation(mapLocation);
    }, [loading]);
    return (
        <main>
         <section className=" section">
            <div className="container">
                {/* <div className="row align-items-center justify-content-between"> */}
                	<div className="txt-cont" >
	                    <p className="hotelmaps01">--<br className="visible-xs" /> Plantler는 주기적으로<br className="visible-xs" /> 식물 돌봄 호텔 정보를 업데이트 중에 있습니다. <br className="visible-xs" />--</p>
	                    <br />
                        <p className="hotelmaps02">현시점 대한민국<br className="visible-xs" /> 유일무이한 식물 돌봄호텔</p>
	                    <br />
                        <img src={hotel.pin} style={{width: '42px', height: '45px', margin: '0 auto'}} />
	                    <p className="hotelmaps03">가든어스 플랜트 호텔</p>
                        <span className="hotelmaps031">
                        	Earth Plant Hotel<br />
                        	경기 광명시 양지로 17 AK플라자 광명점 1층 (우)14345<br />
                        	<a href="http://gardenearth.club/" target="_blank">http://gardenearth.club/</a>
                        </span>
	                    <br />
                    {/* npm pkg 활용하여 kakaomap 불러오는 부분 */}
                        <Map center={kakaoLocation} style={kakaoMap.style} level={kakaoMap.level}>
                            <MapMarker position={kakaoLocation}/>
                        </Map>
	                    <span className="hotelmaps042">--<br className="visible-xs" /> 식물 돌봄 호텔 예약 문의는<br className="visible-xs" /> 호텔 측으로 직접 문의 바랍니다. <br className="visible-xs" />--</span>
	                </div>
                </div>
            </section>
        </main>
    );
}

export default Hotelmaps;