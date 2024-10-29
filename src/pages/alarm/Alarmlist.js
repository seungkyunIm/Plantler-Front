import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import alarm from '../../assets/img/alarm';
import { useCookies } from 'react-cookie';
import '../../assets/css/alarm.css';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const modal_header = {
    borderBottom: '3px solid #05725A',
    marginBottom: '30px'
}
const modal_dialog = {
	maxWidth: '690px !important'
}
const modal_content = {
    width: '690px',
    maxWidth: '100%',
    padding: '50px',
    borderRadius: '30px',
	backgroundColor: 'white',
	boxShadow: '0 0 20px rgba(0, 0, 0, 0.6)',
	left: '50%',
    transform: 'translate(-50%, 50px)'
}
const modal_body = {
    padding: '0 20px 30px'
}
const modal_title = {
    fontSize: '32px !important',
    fontWeight: '500 !important'
}
const modal_footer = {
    borderTop: '1px solid #a5a5a5'	
}
const modal_h3 = {
    fontSize: '18px',
    fontWeight: '500',
    color: '#333'
}
const modal_select = {
	webkitAppearance: 'none',
    mozAppearance: 'none',
    appearance: 'none',
    background:"url('../../assets/img/alarm/sel_arrow.png') no-repeat 80% 50%/9px auto",
    border: '1px solid #a5a5a5',
    borderradius: '10px',    
    padding: '10px 40px 10px 20px',
	margin: '0 5px'
}
const modal_input = {
	border: '1px solid #a5a5a5',
    borderRadius: '10px',
    padding: '10px 20px',
	margin: '0 5px'
}
const modal_textarea = {
    border: '1px solid #a5a5a5',
    borderRadius: '10px',
    padding: '10px 20px'
}

function ModalView({setModalIsOpen, fun, row}) {
	const [cookie, setCookie] = useCookies();
	const [alarm, setAlarm] = useState(row);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedDate2, setSelectedDate2] = useState(new Date());
	const [selectedDate3, setSelectedDate3] = useState(new Date());	
	
	// 날짜 포맷
	const date_to_str = format => {
		let year = format.getFullYear();
		let month = format.getMonth() + 1;
		if(month<10) month = '0' + month;
		let date = format.getDate();
		if(date<10) date = '0' + date;
		let hour = format.getHours();
		let minute = format.getMinutes();
		if(minute < 10) minute = '0' + minute;
		return year + "-" + month + "-" + date + " " + hour + ":" + minute;
	}

	// 수정
	const editSubmitEvent = () => {
		let alarm_scheduled = date_to_str( selectedDate );
		let alarm_repot = date_to_str( selectedDate2 );
		let alarm_nutrients = date_to_str( selectedDate3 );

		const params = {
			...alarm,
			['alarm_scheduled']: alarm_scheduled,
			['alarm_repot']: alarm_repot,
			['alarm_nutrients']: alarm_nutrients
		}

		axios.post( process.env.REACT_APP_BACK_HOST_URL + "/alarmedit", params, { headers: {'Authorization': cookie.token} })
		.then(res=>{
			if(res.data.state) {
				console.log(params);
				setModalIsOpen(false);
			}
		})
		.catch(error=>console.log(error));
	}
	
	// 등록
	const addSubmitEvent = () => {	
		let alarm_scheduled = date_to_str( selectedDate );
		let alarm_repot = date_to_str( selectedDate2 );
		let alarm_nutrients = date_to_str( selectedDate3 );
		const params = {
			...alarm,
			['alarm_scheduled']: alarm_scheduled,
			['alarm_repot']: alarm_repot,
			['alarm_nutrients']: alarm_nutrients
		}		
		axios.post( process.env.REACT_APP_BACK_HOST_URL + "/alarmadd", params, { headers: {'Authorization': cookie.token} })
		.then(res=>{
			if(res.data.state) {
				setModalIsOpen(false);
			}
		})
		.catch(error=>console.log(error));
	}

	const submitEvent = () => {
		if(fun) {
			editSubmitEvent();
		} else {
			addSubmitEvent();
		}
	}
	const changeEvent = e => {
		const {name, value} = e.target;
		setAlarm({...alarm, [name]:value});
		// setAlarmRepot({...alarmRepot, [name]:value});
		// setAlarmNutrients({...alarmNutrients, [name]:value});
	}

	useEffect(()=>{
		setAlarm({...row});
		if(fun) {
			setSelectedDate(new Date(row.alarm_scheduled2));
			setSelectedDate2(new Date(row.alarm_repot2));
			setSelectedDate3(new Date(row.alarm_nutrients2));
		}
	}, [row]);

	const [list, setList] = useState([]);
	// 삭제
	const deleteEvent = () => {
		axios.post(process.env.REACT_APP_BACK_HOST_URL + "/delete", { 
			alarm_no: alarm.alarm_no, 
			user_no: alarm.user_no
		}, { headers: {'Authorization': cookie.token} })
		.then(res => {
			if (res.data.state) {
				setModalIsOpen(false);
			}
		})
		.catch(error => console.log(error));
	}
	return (
		<Modal
			isOpen={true}
			ariaHideApp={false}
			onRequestClose={() => setModalIsOpen(false)}
			className="w-[50%] h-[58vh] mt-[10%] m-auto bg-bgColor text-lg rounded-[10px] drop-shadow-lg"
		>
			<div id="alarm_add">
				<div className="modal-dialog" style={modal_dialog}>
					<div className="modal-content" style={modal_content}>
						<div className="modal-header" style={modal_header}>
							<h1 className="modal-title fs-5" id="alarm_add_Label" style={modal_title}>식집사 알리미</h1>
							<button type="button" className="btn-close" onClick={ () => setModalIsOpen(false) }></button>
						</div>
						<div className="modal-body" style={modal_body}>
							<h3 style={modal_h3}>물주기 알림시간</h3>
							<ReactDatePicker
								selected={selectedDate} 
								onChange={(date) => setSelectedDate(date)} 
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								timeCaption="time"
								dateFormat="yyyy/MM/dd aa h:mm"
								className='modal_datepicker'
							/>
						</div>
						<div className="modal-body" style={modal_body}>
							<h3 style={modal_h3}>분갈이 알림시간</h3>
							<ReactDatePicker
								selected={selectedDate2} 
								onChange={(date) => setSelectedDate2(date)} 
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								timeCaption="time"
								dateFormat="yyyy/MM/dd aa h:mm"
								className='modal_datepicker'
							/>
						</div>
						<div className="modal-body" style={modal_body}>
							<h3 style={modal_h3}>영양제 알림시간</h3>							
							<ReactDatePicker
								selected={selectedDate3} 
								onChange={(date) => setSelectedDate3(date)} 
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								timeCaption="time"
								dateFormat="yyyy/MM/dd aa h:mm"
								className='modal_datepicker'
							/>
						</div>
						<div className="modal-body" style={modal_body}>
							<h3 style={modal_h3}>식물이름</h3>
							<input type="text" name="alarm_plantname" className="w_100" placeholder="식물 이름을 입력해주세요." style={modal_input} value={alarm.alarm_plantname} onChange={changeEvent} />	
						</div>
						<div className="modal-body" style={modal_body}>
							<h3 style={modal_h3}>메모</h3>
							<textarea type="text" name="alarm_memo" className="w_100" rows="3" placeholder="메모를 입력해주세요." style={modal_textarea} value={alarm.alarm_memo} onChange={changeEvent} ></textarea>
						</div>
						<div className="modal-footer" style={modal_footer}>
							<div className="mg_auto">
								<button type="button" className="btn_primary btn_cancle" onClick={ () => setModalIsOpen(false) }>취소</button>
								<button type="button" className="btn_primary btn_add" onClick={submitEvent}>알림 {fun? '수정' : '등록'}</button>
								{fun? <button type="button" className="btn_primary btn_add" onClick={deleteEvent}>삭제</button> : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}

function Alarmlist() {	
	// modal 
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [fun, setFun] = useState(false);
	const nullAlarm = {alarm_plantname: '', alarm_memo: ''};
	const [row, setRow] = useState(nullAlarm);
	const [cookie, setCookie] = useCookies();

	// 알림 목록
	const [list, setList] = useState([]);
	useEffect(()=>{
		axios.post(process.env.REACT_APP_BACK_HOST_URL + "/alarmlist", { 
			alarm_no: alarm.alarm_no, 
			user_no: alarm.user_no
		}, {headers: {'Authorization': cookie.token}})
			.then(res=> {
				if(res.data.state) {
					setList(res.data.result);
				} 
			})
	}, [modalIsOpen]);

	const modalEvent = (type, value) => {
		if(type === 'add') {
			if (list.length >= 10) {
				alert("알림 등록은 최대 10개까지만 가능합니다.");
				return;
			}
			setFun(false);
			setRow(nullAlarm);
		} 

		if(type === 'detail') {
			setFun(true);
			setRow(value);
		}
		setModalIsOpen(true);
	}
		
	return (
		<>			
			<section className="section alarm">
				<div className="container">
					<div className="row">
						<div className="col-md-12 col-sm-12" style={{minHeight: '500px'}}>						
							<h1 className="sub_title">식집사 알리미</h1>
							<p>※ 식물은 총 10개까지 등록할 수 있습니다.</p>
							<button type="button" className="list_btn" onClick={()=> modalEvent('add')}>등록</button>
							<table className="sub_table alarm">
								<colgroup>
									<col width="20%" />
									<col width="20%" />
									<col width="20%" />
									<col width="20%" />
									<col width="20%" />
								</colgroup>
								<tbody>
								{	 
									list.map((v, i) => {
										return (											
											<tr key={i}>
												<td><h1>{v.alarm_plantname}</h1></td>												
												<td>
													<h6><img src={alarm.check_icon_01} className="icon_img" alt="check_icon_01" />물주기 예정</h6>
													<p>{v.alarm_scheduled2}</p>
												</td>
												<td>
													<h6><img src={alarm.check_icon_03} className="icon_img" alt="check_icon_03" />분갈이 예정</h6>
													<p>{v.alarm_repot2}</p>
												</td>
												<td>
													<h6><img src={alarm.check_icon_02} className="icon_img" alt="check_icon_02" />영양제 예정</h6>
													<p>{v.alarm_nutrients2}</p>
												</td>												 
												<td><button type="button" className="btn_more" onClick={()=> modalEvent('detail', v)}>알림 상세 보기</button></td>
											</tr>
										)
									})
								}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>			
			{
				modalIsOpen ? <ModalView setModalIsOpen={setModalIsOpen}  fun={fun}  row={row}/> : null
			}						
		</>
    );
}

export default Alarmlist;