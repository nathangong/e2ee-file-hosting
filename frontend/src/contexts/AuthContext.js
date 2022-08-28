import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('running');
    if (accessToken && accessToken !== 'loading') {
      navigate("../", { replace: true });

      Cookies.set('accessToken', accessToken, { expires: 30 });
    } else if (accessToken === 'loading' ) {
      const tokenCookie = Cookies.get('accessToken');
      setAccessToken(tokenCookie);
    } else {
      Cookies.remove('accessToken');
    }
    console.log(accessToken);
  }, [accessToken, navigate]);

  const value = {
    accessToken,
    setAccessToken
  };
  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  )
}

