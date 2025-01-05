import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

const Spinner = () => {
  return (
    <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open>
      <CircularProgress color='inherit' />
    </Backdrop>
  );
};

export default Spinner;
