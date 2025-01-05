import React, { useEffect } from 'react';
import MaintenanceDashboard from './MaintenanceDashboard';
import useApiClient from '../../../api';
import Spinner from '../../../components/ui/Spinner';

const Dashboard = () => {
  const { get, response, isLoading, isSuccess } = useApiClient();

  const fetchDashboard = async () => {
    await get('Dashboard');
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) return <Spinner/>
  if (!isSuccess) return ;

  return <MaintenanceDashboard data={response} />;
};

export default Dashboard;
