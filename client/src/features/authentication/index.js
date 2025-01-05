import { AuthProvider } from '../../context/AuthContext';
import { useAuth } from './services/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';

export { useAuth, AuthProvider, Login, Register };

export const ENDPOINT = '/Account';
export const LOCAL_STORAGE_NAME = 'user';
export const LOCAL_STORAGE_NAME_ACCESS_TOKEN = 'accessToken';
export const LOCAL_STORAGE_NAME_REFRESH_TOKEN = 'refreshToken';

export const banner = require('./assets/banner.jpg');
