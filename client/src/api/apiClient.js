import { useCallback, useState } from 'react';
import Axios from 'axios';
import { axios } from './axios';

const useApiClient = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const controllerRef = useRef(new AbortController());

  // useEffect(() => {
  //   return () => {
  //     controllerRef.current?.abort('Component unmounted');
  //   };
  // }, []);

  const sendRequest = useCallback(async ({ url, method, data = {}, params = {} }) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    // controllerRef.current?.abort('New request initiated');
    // controllerRef.current = new AbortController();

    try {
      const result = await axios({
        url,
        method,
        data,
        params,
        // signal: controllerRef.current.signal,
      });

      setResponse(result.data);
      setIsSuccess(true);

      return { response: result.data, error: null, isSuccess: true, isLoading: false };
    } catch (ex) {
      if (Axios.isCancel(ex)) {
        console.error(ex.message);
        return { response: null, error: ex.message, isSuccess: false, isLoading: false };
      } else {
        const errorResponse = ex.response?.data || {
          status: ex.response?.status || 500,
          detail:
            ex.response?.detail || (ex.response?.status === 400 ? 'Validation error' : ex.message),
        };

        setError(errorResponse);

        return { response: null, error: errorResponse, isSuccess: false, isLoading: false };
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const apiClient = {
    get: (url, params) => sendRequest({ method: 'GET', url, params }),
    post: (url, data) => sendRequest({ method: 'POST', url, data }),
    put: (url, data) => sendRequest({ method: 'PUT', url, data }),
    patch: (url, data) => sendRequest({ method: 'PATCH', url, data }),
    delete: (url, data) => sendRequest({ method: 'DELETE', url, data }),
    response,
    error,
    isSuccess,
    isLoading,
  };

  return apiClient;
};

export default useApiClient;
