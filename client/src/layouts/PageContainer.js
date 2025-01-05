import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet, useNavigate } from 'react-router-dom';
import medifixLogo from '../features/authentication/assets/MediFix.svg';
import { Button, Typography } from '@mui/material';
import { useAuth } from '../features/authentication';
import { refreshPage } from '../utils/browserHelper';
import { getMenu } from '../routes/routes';
import { getUserGreeting } from '../utils/util';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function PageContainer() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { user, logout, type } = useAuth();

  const menuItems = getMenu(type);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
            <MenuIcon />
          </IconButton>
          <AppBar position='fixed' open={open}>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                sx={{
                  marginRight: 2,
                  ...(open && { display: 'none' }),
                }}>
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  backgroundColor: 'white',
                  padding: '5px',
                  borderRadius: '5px',
                  marginRight: 2,
                  border: '1px solid #1976d2', // מסגרת כחולה זעירה
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Box
                  component='img'
                  sx={{
                    height: 50,
                    width: 'auto',
                  }}
                  alt='MediFix Logo'
                  src={medifixLogo}
                />
              </Box>
              <Box component='div' sx={{ flexGrow: 1 }} />
              {/* כאן אפשר להוסיף כותרת או אלמנטים נוספים */}
              {user && <Typography mr={4}>{getUserGreeting(user.name)}</Typography>}
              {user && (
                <Button
                  variant='contained'
                  color='info'
                  onClick={() => {
                    logout();
                    refreshPage();
                  }}>
                  Logout
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        {menuItems.map((group, index) => {
          return (
            <div key={index}>
              <Divider />
              {group.map((item) => {
                return (
                  <ListItem
                    key={item.id}
                    disablePadding
                    sx={{ display: 'block' }}
                    onClick={() => {
                      navigate(item.path);
                    }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </div>
          );
        })}
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
