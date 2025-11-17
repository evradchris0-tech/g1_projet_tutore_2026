import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api/http';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe(); // check on mount
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // cookie httpOnly est posé par le backend : on rappelle /auth/me
    await fetchMe();
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
