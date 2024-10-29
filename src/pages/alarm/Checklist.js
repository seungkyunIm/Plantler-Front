import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../assets/css/alarm.css';
import alarm from '../../assets/img/alarm';


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

const sticker_img = {
	margin: '0 5px 0 0'
}

function Checklist() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const showModal = () => {
		setModalIsOpen(!modalIsOpen);
	};

	return (
		<>
			<section className="section alarm">
				<div className="container">
					<div className="row">
						<div className="col-md-12 col-sm-12">
							<h1 className="sub_title">나의 식물 체크</h1>					
							<button type="button" className="list_btn" onClick={showModal}>등록</button>
							<select name="calendar_mm" id="hh">
								<option>1월</option>
								<option>2월</option>
								<option>3월</option>
								<option>4월</option>
								<option>5월</option>
								<option>6월</option>
								<option>7월</option>
								<option>8월</option>
								<option>9월</option>
								<option>10월</option>
								<option>11월</option>
								<option>12월</option>
							</select>
							<div className="calendar">
								<ul className="weeks">
									<li>Sun</li>
									<li>Mon</li>
									<li>Tue</li>
									<li>Wed</li>
									<li>Thu</li>
									<li>Fri</li>
									<li>Sat</li>
								</ul>
								<ul className="days">
									<li>1</li>
									<li>2</li>
									<li>3</li>
									<li>4</li>
									<li>5</li>
									<li>6</li>
									<li>7</li>
									<li>8</li>
									<li>9</li>
									<li onClick={showModal}>10
										<p>
											<img src={alarm.check_icon_01} alt="check_icon_01" />
											<img src={alarm.check_icon_02} alt="check_icon_02" />
											<img src={alarm.check_icon_03} alt="check_icon_03" />
										</p>
									</li>
									<li>11</li>
									<li>12</li>
									<li>13</li>
									<li>14</li>
									<li>15</li>
									<li>16</li>
									<li>17</li>
									<li>18</li>
									<li>19</li>
									<li>20</li>
									<li>21</li>
									<li>22</li>
									<li>23</li>
									<li>24</li>
									<li>25</li>
									<li>26</li>
									<li>27</li>
									<li>28</li>
									<li>29</li>
									<li>30</li>
									<li className="inactive">1</li>
									<li className="inactive">2</li>
									<li className="inactive">3</li>
									<li className="inactive">4</li>
									<li className="inactive">5</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>					
			
			{
				modalIsOpen ? (
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
										<h1 className="modal-title fs-5" id="alarm_add_Label" style={modal_title}>나의 식물 체크 등록</h1>
										<button type="button" className="btn-close" onClick={ () => setModalIsOpen(false) }></button>
									</div>
									<div className="modal-body" style={modal_body}>
										<h3 style={modal_h3}>알림시간</h3>
										<input type="date" value="" id="date" style={modal_input} />
										<select name="time_ampm" id="ampm" style={modal_select}>
											<option>오전</option>
											<option>오후</option>
										</select>
										<select name="time_hh" id="hh" style={modal_select}>
											<option>01</option>
											<option>02</option>
											<option>03</option>
											<option>04</option>
											<option>05</option>
											<option>06</option>
											<option>07</option>
											<option>08</option>
											<option>09</option>
											<option>10</option>
											<option>11</option>
											<option>12</option>
										</select>
										<select name="time_mm" id="mm" style={modal_select}>
											<option>00</option>
											<option>10</option>
											<option>20</option>
											<option>30</option>
											<option>40</option>
											<option>50</option>
										</select>
									</div>
									<div className="modal-body" style={modal_body}>							
										<h3 style={modal_h3}>메모</h3>
										<textarea type="text" id="plant_name" class="w_100" rows="3" placeholder="메모를 입력해주세요." style={modal_textarea}></textarea>
									</div>
									<div class="modal-body" style={modal_body}>
										<h3 style={modal_h3}>스티커</h3>
										<ul class="check_sticker">
											<li class="active" style={sticker_img}>
												<img src={alarm.check_icon_01} alt="물주기" /><br />
												<p>물<br class="visible-xs" /> 준 날</p>
											</li>
											<li style={sticker_img}>
												<img src={alarm.check_icon_02} alt="영양제" /><br />
												<p>영양제<br class="visible-xs" /> 준 날</p>
											</li>
											<li style={sticker_img}>
												<img src={alarm.check_icon_03} alt="분갈이" /><br />
												<p>분갈이<br class="visible-xs" /> 한 날</p>
											</li>
										</ul>
									</div>
									<div className="modal-footer" style={modal_footer}>
										<div className="mg_auto">
											<button type="button" className="btn_primary btn_cancle" onClick={ () => setModalIsOpen(false) }>취소</button>
											<button type="button" className="btn_primary btn_add">알림 등록</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Modal>
				) : null
			}
			
		</>
    );

}

export default Checklist;
