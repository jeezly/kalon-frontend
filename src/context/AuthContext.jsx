import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('kalonToken');
        if (token) {
          api.setAuthToken(token);
          const [userResponse, creditsResponse] = await Promise.all([
            api.getMe(),
            api.getUserCredits()
          ]);

          setUser({
            ...userResponse.data.user,
            creditos: creditsResponse.data.data.creditos
          });
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('kalonToken');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
  try {
    const response = await api.login({ email, password });
    if (response.data?.success) {
      const { token, user } = response.data;
      localStorage.setItem('kalonToken', token);
      api.setAuthToken(token);

      // Obtener datos completos del usuario incluyendo créditos
      const [userResponse, creditsResponse] = await Promise.all([
        api.getMe(),
        api.getUserCredits()
      ]);

      setUser({
        ...userResponse.data.user,
        creditos: creditsResponse.data.data.creditos
      });

      navigate(user.rol === 'admin' ? '/admin/dashboard' : '/cliente/inicio');
    }
  } catch (error) {
    setError('Error al iniciar sesión');
    console.error(error);
  }
};

  const logout = () => {
    localStorage.removeItem('kalonToken');
    api.setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

 const updateUser = async (newUserData) => {
  try {
    // Actualizar el estado local primero para respuesta inmediata
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData
    }));
    
    // Recargar datos completos del backend para asegurar consistencia
    const [userResponse, creditsResponse] = await Promise.all([
      api.getMe(),
      api.getUserCredits()
    ]);
    
    setUser({
      ...userResponse.data.user,
      creditos: creditsResponse.data.data.creditos
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.rol === 'admin',
        clearError: () => setError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
