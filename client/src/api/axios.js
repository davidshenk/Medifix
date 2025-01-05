import Axios from 'axios';
import { spreadTrim } from '../utils/stringHelper';

export const axios = Axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_BASE_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export const setupAxiosInterceptors = (
  getAccessToken,
  getRefreshToken,
  setAuthInfo,
  clearAuthInfo
) => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (!config._retry && token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },

    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const originalRequestUrl = spreadTrim(originalRequest.url, '/');

      const needsRefresh =
        error.response?.status === 401 &&
        originalRequestUrl !== 'Account/login' &&
        originalRequestUrl !== 'Account/refresh' &&
        !originalRequest._retry;

      if (needsRefresh) {
        originalRequest._retry = true;
        try {
          const response = await axios.post('Account/refresh', {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken(),
          });
          setAuthInfo(response.data);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          clearAuthInfo();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
