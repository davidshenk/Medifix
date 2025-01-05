/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { axios, setupAxiosInterceptors } from '../api/axios';
import {
  ENDPOINT,
  LOCAL_STORAGE_NAME,
  LOCAL_STORAGE_NAME_ACCESS_TOKEN,
  LOCAL_STORAGE_NAME_REFRESH_TOKEN,
} from '../features/authentication';

const AuthContext = createContext({});

const getAccessToken = () => localStorage.getItem(LOCAL_STORAGE_NAME_ACCESS_TOKEN);
const getRefreshToken = () => localStorage.getItem(LOCAL_STORAGE_NAME_REFRESH_TOKEN);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_NAME);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(getAccessToken);
  const [refreshToken, setRefreshToken] = useState(getRefreshToken);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenActive = accessToken && user;

  const setAuthInfo = (response) => {
    const userData = getUserDataFromResponse(response);
    const { accessToken, refreshToken } = response;

    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(userData));
    localStorage.setItem(LOCAL_STORAGE_NAME_ACCESS_TOKEN, accessToken);
    localStorage.setItem(LOCAL_STORAGE_NAME_REFRESH_TOKEN, refreshToken);
  };

  const clearAuthInfo = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem(LOCAL_STORAGE_NAME);
    localStorage.removeItem(LOCAL_STORAGE_NAME_ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_NAME_REFRESH_TOKEN);
  };

  const getUserDataFromResponse = (response) => {
    const jwt = jwtDecode(response.accessToken);
    return { ...response, ...jwt };
  };

  useEffect(() => {
    const initAuth = async () => {
      if (user?.exp) {
        const now = Date.now() / 1000;
        if (user.exp > now) {
          setIsLoading(false);
          return;
        }
      }

      if (accessToken && refreshToken) {
        try {
          const response = await axios.post(`${ENDPOINT}/refresh`, {
            accessToken,
            refreshToken,
          });
          setAuthInfo(response.data);
        } catch (error) {
          clearAuthInfo();
        }
      }

      setIsLoading(false);
    };

    if (isLoading) {
      initAuth();
    }
  }, [isLoading]);

  useLayoutEffect(() => {
    setupAxiosInterceptors(
      getAccessToken,
      getRefreshToken,
      setAuthInfo,
      clearAuthInfo
    );
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        setAuthInfo,
        clearAuthInfo,
        isTokenActive,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
