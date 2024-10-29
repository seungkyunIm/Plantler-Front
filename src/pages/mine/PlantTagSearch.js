import '../../assets/css/mine.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import Modal from 'react-modal';
import mine from '../../assets/img/mine';

const PlantTagSearch = () => {
	const [plantTag, setPlantTag] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedKeywords, setSelectedKeywords] = useState([]);
	const [keywords, setKeywords] = useState([]);

	
	useEffect(()=>{
		const fetchPlants = async () => {
			axios.get(process.env.REACT_APP_BACK_HOST_URL +'/api/plantTag')
			.then((res)=>{setPlantTag(res.data)})
			.catch((error)=>{console.error("Error fetching plants:", error)})
		};
		
		const fetchKeywords = async () => {
			axios.get(process.env.REACT_APP_BACK_HOST_URL +'/api/plantKeyword')
			.then((res)=>{setKeywords(res.data)})
			.catch((error)=>{console.error("Error fetching keywords:", error)})
		};

		Modal.setAppElement('#app'); // 여기에 실제 앱의 루트 요소 ID를 지정

		fetchPlants();
		fetchKeywords();

		// localStorage에서 선택한 키워드 불러오기
        const storedKeywords = localStorage.getItem('selectedKeywords');
        if (storedKeywords) {
            setSelectedKeywords(JSON.parse(storedKeywords));
        }

	},[]);
	
	if (!plantTag || plantTag.length === 0) {
		return <div>식물 정보가 없습니다.</div>; // 데이터가 없을 때
	}
	
	
	const lastPlant = plantTag[plantTag.length - 1]; // 마지막 식물 정보
	
	const filteredPlantList = selectedKeywords.length > 0 
    ? plantTag.filter(plant => 
		plant.keyword1 || plant.keyword2 || plant.keyword3 // 존재하는 키워드 속성을 검사
        ? selectedKeywords.some(keyword => 
            [plant.keyword1, plant.keyword2, plant.keyword3].includes(keyword)
        )
        : false
    ) 
    : plantTag; 

	const plantList = filteredPlantList.map((plant) => {
    const imgSrc = plant.plantImage ? `${plant.plantImage}` : '/assets/img/default.png'; // 이미지 경로 확인
	// console.log(filteredPlantList)
	return (
        <div className="mine4" key={plant.plantNo}>
            <a href={`/plantDetail?id=${plant.plantNo}`}>
                <img src={imgSrc} alt={plant.plantTitle} />
            </a>
            <p className="text-center">{plant.plantTitle}</p>
        </div>
    );
});

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};

	const handleKeywordSelect = (keyword) => {
        setSelectedKeywords((prev) => {
            const newSelectedKeywords = prev.includes(keyword)
                ? prev.filter((kw) => kw !== keyword) // 이미 선택된 키워드라면 제거
                : [...prev, keyword];

            // localStorage에 선택된 키워드 저장
            localStorage.setItem('selectedKeywords', JSON.stringify(newSelectedKeywords));
            return newSelectedKeywords;
        });
    };

    const removeKeyword = (keyword) => {
        setSelectedKeywords((prev) => {
            const newSelectedKeywords = prev.filter((kw) => kw !== keyword);
            localStorage.setItem('selectedKeywords', JSON.stringify(newSelectedKeywords));
            return newSelectedKeywords;
        });
    };

    const clearSelectedKeywords = () => {
        setSelectedKeywords([]);
        localStorage.removeItem('selectedKeywords'); // localStorage도 초기화
    };

    return(
        <>
        <section className="section">
       		<div className="container">
            	<div className="row">
                	<div className="col-md-12 col-sm-12">
						<h1 className="sub_title">나만의 식물 찾기</h1>
					
						<h4 className="text-center">식물을 잘 모를때에는</h4>
						<div className="minetag">
							<a href="#" onClick={openModal}>
								<img src={mine.filter} alt ={mine.filter} style={{marginBottom : '10px'}}/>
							</a>
							{selectedKeywords.length > 0 ? (
								selectedKeywords.map((keyword, index) => (
									<button key={index} className="btn btn-secondary" style={{ width: '200px', marginBottom: '10px' }} onClick={()=>removeKeyword(keyword)}>#{keyword}</button>
								))
							) : null }
							<div className='mine4-container'>
								<div>
									<p>현재 선택한 필터 {selectedKeywords.length}</p>
								</div>
								<div style={{marginRight : '25px'}}>
									<p>현재 식물 데이터 {lastPlant.plantNo}종 </p>
								</div>
							</div>
	                	</div>
						<div className="mine-container4">
							{plantList}
			            </div>
	            	</div>
	        	</div>
			</div>
	    </section>
        
		<Modal 
			isOpen={modalIsOpen} 
			onRequestClose={closeModal}
			appElement={document.getElementById('app')} // 여기에 실제 앱의 루트 요소 ID를 지정
			contentLabel="키워드 선택"
			style={{
				content: {
					maxWidth: '700px', // 원하는 최대 너비로 조정
					margin: 'auto', // 모달을 중앙에 배치
					borderRadius : '5'
				},
			}}
		>
			<h2 style={{textAlign:'center'}}>키워드 선택</h2>
			<div style={{ textAlign: 'right', marginBottom: '10px' }}>
				<button onClick={clearSelectedKeywords} style={{ marginLeft: '10px' }}>초기화</button> {/* 초기화 버튼 추가 */}
                <button onClick={closeModal} >닫기</button>
			</div>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
				{keywords.map((keyword) => (
                        <div key={keyword.keywordNo} style={{ flex: '0 0 calc(33% - 10px)' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.includes(keyword.keywordName)}
                                    onChange={() => handleKeywordSelect(keyword.keywordName)}
                                />
                                {keyword.keywordName}
                            </label>
                    	</div>
                	))}
            </div>
		</Modal>
        </>
    );
}

export default PlantTagSearch;