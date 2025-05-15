import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // loading flag

  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false); // we're done loading
  }, []);

  const login = (accessToken) => {
    localStorage.setItem('access', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // eslint-disable-line
