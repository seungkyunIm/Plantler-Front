import '../../assets/css/mine.css';
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import axios from 'axios';


const PlantRecomend = () =>{
		const [plants, setPlants] = useState([]);
		const location = useLocation();
		const [searchParams, setSearchParams] = useSearchParams();
		const keywordremove = () => {
			localStorage.removeItem('selectedKeywords');
		};
		
		useEffect(()=>{
			const fetchPlants = async () => {
	
				// localStorage에서 데이터 읽기
				const savedPlants = localStorage.getItem('plants');
				if (savedPlants) {
					setPlants(JSON.parse(savedPlants));
				} else {
				axios.get(process.env.REACT_APP_BACK_HOST_URL +'/api/randomPlants',{
					params: {
						questionNo: searchParams.get("questionNo")
					}
				})
				.then((res)=>{
					const plantData = res.data.slice(0, 5);
					setPlants(plantData);
					localStorage.setItem('plants', JSON.stringify(plantData));
					})
				.catch((error)=>{console.error("Error fetching plants:", error)});
				}
			};
	
			fetchPlants();
		},[location.search]);

	if (!plants || plants.length === 0) {
		return <div>식물 정보가 없습니다.</div>; // 데이터가 없을 때
	}
	
	const plantRecList = plants.map((plant) => { 
		return(
			<div className="mine2" key={plant.plantNo}>
		            	<a href={`/plantDetail?id=${plant.plantNo}`}>
		                	<img src={plant.plantImage} alt={plant.plantTitle} />
		                </a>
		                <p className="text-center">{plant.plantTitle}</p>
		                <div className="options">
		                    <button className="btn btn-secondary" style={{width: '200px', marginBottom: '10px'}}>{plant.keyword1}</button>
		                    <button className="btn btn-secondary" style={{width: '200px', marginBottom: '10px'}}>{plant.keyword2}</button>
		                    <button className="btn btn-secondary" style={{width: '200px', marginBottom: '10px'}}>{plant.keyword3}</button>
		                </div>
		    </div>
		);
	})
    return(
    <>
    <section className="section">
       		<div className="container">
            	<div className="row">
                	<div className="col-md-12 col-sm-12">
						<h1 className="sub_title">나만의 식물 찾기</h1>
					
						<h4 className="text-center">당신의 선택에 추천드리는 식물은</h4>
						<div className="mine-container2">
						{plantRecList}
					</div>       
                </div>
            </div>
        </div>
        <div style={{textAlign: 'center'}}>
        <a href="/plantMine" className="selecbtn">다시 선택</a>
        <a href="/plantTagSearch" style={{marginLeft: '40px'}} className="selecbtn" onClick={keywordremove}>여기는 제가 원하는 식물이 없어요!</a>
        </div>
    	</section>
    </>
    );
}

export default PlantRecomend;