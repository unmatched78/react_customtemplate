// src/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import api from './api';
import * as jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const login = useCallback(async (username, password) => {
    try {
      console.log('[Auth] Sending login request…', { username });
      const { data } = await api.post('/auth/token/login/', { username, password });
      console.log('[Auth] Received login response', data);
  
      const { access, refresh, user: userData } = data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      // src/AuthContext.jsx (inside login)
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.Authorization = `Bearer ${access}`;
      setUser(userData);

    } catch (err) {
      console.error('[Auth] Login failed:', err.response?.data || err);
      throw err;
    }
  }, []);


  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.Authorization;
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
  
    if (token && storedUser) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    } else {
      logout();
    }
    setLoading(false);
  }, [logout]);
  

  // Optional: refresh on 401
  useEffect(() => {
    const id = api.interceptors.response.use(
      res => res,
      async error => {
        if (error.response?.status === 401) {
          // try refresh
          try {
            const { data } = await api.post('/auth/token/refresh/', {
              refresh: localStorage.getItem('refreshToken'),
            });
            localStorage.setItem('accessToken', data.access);
            api.defaults.headers.Authorization = `Bearer ${data.access}`;
            error.config.headers.Authorization = `Bearer ${data.access}`;
            return api.request(error.config);
          } catch {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
