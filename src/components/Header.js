import React, { useRef } from 'react';
import { List, Person, Search, Gear } from 'react-bootstrap-icons';
import main from '../assets/img/main';
import { useAuth } from '../pages/login/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies();

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // 로그아웃 처리
    navigate('/');
    window.location.reload();
  };


  // 모바일 토글 버튼 js
  const mobileclick = () => {
    function toggleScrolled() {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    /* Mobile nav toggle */
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    function mobileNavToogle() {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

    /* Hide mobile nav on same-page/hash links */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    /** Toggle mobile nav dropdowns*/
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();}
      );
    });
  }  

  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <h1 className="sitename">
          <Link to="/">
            <img src={main.logo} alt="logo" />
          </Link>
        </h1>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <Link to="/plantMine">나만의 식물</Link>
            </li>
            {
              cookie.token != null ?
                <li className="dropdown">
                  <Link to="/alarmlist">
                    <span>식집사 알리미</span>
                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </Link>
                  {/* <ul>
                    <li>
                      <Link to="/alarmlist">물주기 알림</Link>
                    </li>
                    <li>
                      <Link to="/checklist">나의 식물 체크</Link>
                    </li>
                  </ul> */}
                </li>
              : ''              
            }
            <li className="dropdown">
              <Link to="/khboardlist">
                <span>식집사 게시판</span>{' '}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </Link>
              <ul>
                <li>
                  <Link to="/khboardlist">키우기 노하우</Link>
                </li>
                <li>
                  <Link to="/freeboardlist">식물 무료 나눔</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/hotellist">식물 돌봄 호텔</Link>
            </li>
            {isLoggedIn ? (
              <li className='navmenu-li-none'>
                <Link to="#" onClick={handleLogout}>로그아웃</Link>
              </li>
            ) : (
            <>
              <li className='navmenu-li-none'>
                <Link to="/signup">회원가입</Link>
              </li>
              <li className='navmenu-li-none'>
                <Link to="/login">로그인</Link>
              </li>
            </>
            )}
          </ul>
          <List className="mobile-nav-toggle d-xl-none bi bi-list" onClick={mobileclick} />
        </nav>
        <div>
          {/*<Link to="/allsearch" className="nav_icon fs_18">
              <Search className="bi bi-search" />
          </Link>*/}
          {isLoggedIn ? (
            <>              
              <Link to="/userinfo" className="nav_icon">
              <span className="login_txt">{cookie.user_nick}님</span><Gear className="bi bi-gear" />
              </Link>
              <a href="/" className="nav_btn" onClick={handleLogout}>
                로그아웃
              </a>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav_icon">
                <Person className="bi bi-person" /><span className="login_txt">회원가입</span>
              </Link>
              <Link to="/login" className="nav_btn">로그인</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
