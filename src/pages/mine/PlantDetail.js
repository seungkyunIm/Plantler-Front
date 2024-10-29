import '../../assets/css/mine.css';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const PlantDetail = () => {
	const [plDetail, setPlDetail] = useState(null);
	const navigate = useNavigate();

	useEffect(()=>{
		const fetchPlantDetail = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const plantId = urlParams.get('id');
			axios.get(`${process.env.REACT_APP_BACK_HOST_URL}/api/plantDetail?id=${plantId}`)
			.then((res)=>{setPlDetail(res.data)})
			.catch((error)=>{console.error("Error fetching plants:", error)})
		};

		fetchPlantDetail();
	},[]);

	if (!plDetail) {
		return <div>식물 정보가 없습니다.</div>; // 데이터가 없을 때
	}
	const imgSrc = plDetail.plantImage || '/assets/img/default.png'; // 이미지 경로 확인

    return(
        <>
        <section className="section">
       		<div className="container">
            	<div className="row">
                	<div className="col-md-12 col-sm-12">
						<h1 className="sub_title">나만의 식물 찾기</h1>
						
						<h4 className="detailname text-center">식과 사전</h4>
						<div className='detailbox'>
						<div className="mine-container3" style={{margin:'10px'}}>
							<div className="mine3 text-center">
		        				<img src={imgSrc} alt={plDetail.plantTitle} />
		    				</div>
						<div className="options3" style={{margin:'10px'}}>
		        			<div className='text-center'>
								<button className="btn btn-secondary" style={{width:'750px' , fontSize: '150%', marginBottom:'10px'}}>{plDetail.plantTitle}</button>        
							</div>
		        			<ul> 
								<button className="btn btn-secondary" style={{width: '260px', marginBottom: '5px', marginLeft : '10px'}}>#{plDetail.keyword1}</button>
								<button className="btn btn-secondary" style={{width: '260px', marginBottom: '5px', marginLeft : '10px'}}>#{plDetail.keyword2}</button>
								<button className="btn btn-secondary" style={{width: '260px', marginBottom: '5px', marginLeft : '10px'}}>#{plDetail.keyword3}</button>
							</ul>
		    				<div> 
								<h5>{plDetail.plantContent}</h5>
							</div>
							<div className='khdetail-container'>
			        			<div className="khdetail">
									<p style={{textAlign : 'center'}}> 노하우 1</p>
									<p style={{textAlign : 'center'}}>{plDetail.knowhow1}</p>
		            			</div>
								<div className="khdetail">
									<p style={{textAlign : 'center'}}> 노하우 2</p>
									<p style={{textAlign : 'center'}}>{plDetail.knowhow2}</p>
		            			</div>
							</div>
						</div>
            			</div>
						</div>
		        	<div style={{textAlign: 'center'}}>
		            	<div className="selecbtn" onClick={() => navigate(-1)}>뒤로 돌아가기</div>
		        	</div>
				</div>
        	</div>
		</div>
    	</section>
        </>
    );
}

export default PlantDetail;