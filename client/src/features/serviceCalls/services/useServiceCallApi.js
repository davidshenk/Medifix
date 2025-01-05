// useServiceCallApi.js
import useApiClient from '../../../api/apiClient';
import { useAlert } from '../../../context/AlertContext';

export const useServiceCallApi = () => {
  const apiClient = useApiClient();
  const { displayAlert } = useAlert();

  const fetchData = async (endpoint, params = {}) => {
    const { isSuccess, response, error } = await apiClient.get(endpoint, params);
    if (!isSuccess) {
      displayAlert(error);
      return null;
    }
    return response.items;
  };

  return {
    fetchBuildings: () => fetchData('Locations/types/1'),
    fetchChildren: (parentId) => fetchData(`Locations/${parentId}/children`),
    fetchCategories: () => fetchData('Categories'),
    fetchSubCategories: (categoryId) => fetchData(`SubCategories`, { categoryId }),
    fetchLocation: (locationId) => fetchData(`Locations/${locationId}`, { withParents: true }),
    fetchClients: () => fetchData('Clients'),
    submitServiceCall: (data) => apiClient.post('ServiceCalls', data),
  };
};
