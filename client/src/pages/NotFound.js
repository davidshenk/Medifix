import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        עמוד לא נמצא
      </Typography>
      <Typography variant="body1" paragraph>
        מצטערים, העמוד שחיפשת לא קיים.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        חזרה לדף הבית
      </Button>
    </Box>
  );
};

export default NotFound;