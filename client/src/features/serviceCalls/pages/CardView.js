import React from 'react';
import ServiceCallCard from '../components/ServiceCallCard';
import { Grid } from '@mui/material';

const CardView = ({ serviceCalls, showActionButtons }) => {
  return (
    <Grid container spacing={2}>
      {serviceCalls.map((row) => (
        <Grid key={row.serviceCallId} item xs={12} sm={6} md={4} lg={3}>
          <ServiceCallCard key={row.Id} row={row} showActionButtons={showActionButtons} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardView;
