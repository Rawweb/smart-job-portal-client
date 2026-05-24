import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Create the AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if the token is valid and fetch user data on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // called after successful login to set user data and token
  const saveAuth = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // called on logout to clear user data and token
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — instead of writing useContext(AuthContext) everywhere
// any component just writes useAuth()
export const useAuth = () => useContext(AuthContext)
