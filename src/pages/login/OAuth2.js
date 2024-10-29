import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {useAuth} from './AuthContext';

export const OAuthLogin = () => {
  const {setIsLoggedIn} = useAuth();
  const navigate = useNavigate();
  const {token, provider, user_nick} = useParams();
  const [cookie, setCookie] = useCookies();
  useEffect(()=> {
    if(!token) return;

    const now = new Date();
    const expires = new Date(now.setMonth(now.getMonth() + 1));
    // console.log(decodeURIComponent(user_nick), user_nick);
    setCookie('token', token, {expires, path: '/'});
    setCookie('provider', provider, {expires, path: '/'});
    setCookie('user_nick', user_nick, {expires, path: '/'});
    setIsLoggedIn(true);
    navigate('/login');
}, [token]);
  return <></>;
}

export const OAuthLogout = () => {
  const navigate = useNavigate();
  const {status} = useParams();
  useEffect(()=> {
    if(status === 'success') {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);
  return <></>;
}
