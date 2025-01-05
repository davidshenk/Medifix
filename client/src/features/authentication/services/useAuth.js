import { useCallback, useMemo } from 'react';
import useApiClient from '../../../api';
import { useAuthContext } from '../../../context/AuthContext';
import { ENDPOINT } from '..';
import { refreshPage } from '../../../utils/browserHelper';

export function useAuth() {
  const apiClient = useApiClient();
  const { user, accessToken, refreshToken, setAuthInfo, clearAuthInfo, isLoading } =
    useAuthContext();

  const roles = useMemo(() => user?.roles?.split(',') || [], [user]);
  const type = roles[0];

  const register = useCallback(
    async (registerObj) => {
      const { isSuccess, error } = await apiClient.post(`${ENDPOINT}/register`, registerObj);

      return { isSuccess, error };
    },
    [apiClient]
  );

  const login = useCallback(
    async (email, password) => {
      const { response, isSuccess, error } = await apiClient.post(`${ENDPOINT}/login`, {
        email,
        password,
      });

      if (isSuccess) {
        setAuthInfo(response);
      }

      return { isSuccess, error };
    },
    [apiClient, setAuthInfo]
  );

  const logout = useCallback(
    (refresh = false) => {
      clearAuthInfo();
      if (refresh) {
        refreshPage();
      }
    },
    [clearAuthInfo]
  );

  const hasRole = useCallback(
    (role) => {
      return roles.includes(role);
    },
    [roles]
  );

  return {
    user,
    roles,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    hasRole,
    type,
    isLoading,
  };
}
