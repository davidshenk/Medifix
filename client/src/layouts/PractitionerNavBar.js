import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, CssBaseline, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/authentication';

const PractitionerNavBar = () => {
  const [value, setValue] = useState();
  const { logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    switch (value) {
      case 'profile':
        break;
      case 'serviceCalls':
        navigate('/');
        break;
      case 'logout':
        logout(true);
        break;
      default:
        break;
    }
  }, [logout, navigate, value]);

  return (
    <>
      <Box sx={{ p: 2, pb: 7, backgroundColor: 'background.paper' }}>
        <CssBaseline />
        <Outlet />

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}>
            <BottomNavigationAction label='Profile' icon={<AccountCircleIcon />} value='profile' />
            <BottomNavigationAction
              label='Service Calls'
              icon={<HomeRepairServiceIcon />}
              value='serviceCalls'
            />
            <BottomNavigationAction label='Logout' icon={<LogoutIcon />} value='logout' />
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
};

export default PractitionerNavBar;
