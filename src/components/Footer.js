import React from 'react';
import { Facebook } from 'react-bootstrap-icons';
import { Instagram } from 'react-bootstrap-icons';
import main from '../assets/img/main';

function Footer() {
    const style = {textDecoration: "none"}
    return (
        <footer id="footer" className="footer light-background">
            <div className="container ">
                <div className="row">
                    <div className="col-md-3 col-sm-12">
                        <img src={main.footer_logo} alt="footer logo" />                   
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <div className="widget">
                            <h3 className="widget-heading ">
                                <a href="/" style={style}>개인정보처리방침</a>  |  <a href="/" style={style}>프로젝트 소개서</a>
                            </h3>
                            <ul className="list-unstyled footer-blog-entry">
                                <li>
                                    <p>서울시 서대문구 하이미디어 아카데미 </p>
                                    <span className="d-block date ">수강생 Team 5STONES / 김보경 박윤신 임승균 장윤은 장은실</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-3 pl-lg-5 ">
                        {/* <div className="widget ">
                            <h3 className="widget-heading">Connect</h3>
                            <ul className="list-unstyled social-icons light mb-3 ">
                                <li>
                                    <a href="/" style={style}><span><Facebook className="bi bi-facebook" /></span></a>
                                </li>
                                <li>
                                    <a href="/" style={style}><span><Instagram className="bi bi-instagram" /></span></a>
                                </li>
                            </ul>
                        </div> */}                        
                    </div>
                </div>

                <div className="copyright d-flex flex-column flex-md-row align-items-center justify-content-md-between ">
                    <p><span>Copyright</span>© 2024 <strong className="px-1 sitename ">PLANTLER.</strong><span> All Rights Reserved.</span></p>
                    <div className="credits ">
                        Designed by Team 5STONES
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
