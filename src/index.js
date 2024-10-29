import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/css/common.css';
import './assets/css/main.css';
import './assets/css/login.css';
import Header from './components/Header';
import Footer from './components/Footer';
import App from './App';
import PlantMine from './pages/mine/PlantMine';
import PlantRecomend from './pages/mine/PlantRecomend';
import PlantDetail from './pages/mine/PlantDetail';
import PlantTagSearch from './pages/mine/PlantTagSearch';
import Alarmlist from './pages/alarm/Alarmlist';
import Khboardlist from './pages/board/Khboardlist';
import Khboarddetail from './pages/board/Khboarddetail';
import Khboardadd from './pages/board/Khboardadd';
import Khboardupdate from './pages/board/Khboardupdate';
import Login from './pages/login/Login';
import Findid from './pages/login/Findid';
import Findpwd from './pages/login/Findpwd';
import Signup from './pages/login/Signup';
import Userinfo from './pages/login/Userinfo';
import Freeboardlist from './pages/board/Freeboardlist';
import Freeboarddetail from './pages/board/Freeboarddetail';
import Freeboardadd from './pages/board/Freeboardadd';
import Freeboardupdate from './pages/board/Freeboardupdate';
import Hotellist from './pages/hotel/Hotellist';
import Hotelmaps from './pages/hotel/Hotelmaps';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { AuthProvider } from './pages/login/AuthContext'; // 추가된 부분
import {OAuthLogin, OAuthLogout} from'./pages/login/OAuth2'; // 추가된 부분

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
    // <React.StrictMode>
      <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/plantMine' element={<PlantMine />}></Route>
          <Route path="/plantRecomend" element={<PlantRecomend />}></Route>
			    <Route path="/plantDetail" element={<PlantDetail />}></Route>
			    <Route path="/plantTagSearch" element={<PlantTagSearch />}></Route>
          <Route path='/alarmlist' element={<Alarmlist />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/findid" element={<Findid />}></Route>
          <Route path="/findpwd" element={<Findpwd />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/userinfo" element={<Userinfo />}></Route>

          <Route path='/freeboardlist' element={<Freeboardlist />}></Route>
          <Route path='/freeboarddetail/:board_no' element={<Freeboarddetail />}></Route>
          <Route path='/freeboardadd' element={<Freeboardadd />}></Route>
          <Route path='/freeboardupdate/:board_no' element={<Freeboardupdate />}></Route>
          <Route path='/freeboardlist/:category_id' element={<Freeboardlist />}></Route>

          <Route path='/khboardlist' element={<Khboardlist />}></Route>
          <Route path='/khboarddetail/:board_no' element={<Khboarddetail />}></Route>
          <Route path='/khboardadd' element={<Khboardadd />}></Route>
          <Route path='/khboardupdate/:board_no' element={<Khboardupdate />}></Route>
          <Route path='/khboardlist/:category_id' element={<Khboardlist />}></Route>
          
          <Route path='/hotellist' element={<Hotellist />}></Route>
          <Route path='/hotelmaps' element={<Hotelmaps />}></Route>
          <Route path='/auth/:token/:provider/:user_nick' element={<OAuthLogin />}></Route>
          <Route path='/oauth2/:status' element={<OAuthLogout />}></Route>
        </Routes>
        <Footer />
      </AuthProvider>
      </BrowserRouter>
   // </React.StrictMode>
);