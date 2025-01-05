import { Button, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { banner } from '../features/authentication';
import Image from 'mui-image';
import useDense from '../hooks/useDense';

const AuthLayout = ({ children, header, bottomButton }) => {
  const { isMobile } = useDense();

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      sx={{
        minHeight: '96vh',
      }}>
      <Grid
        container
        maxWidth='md'
        sx={{
          p: { xs: 2, sm: 4 },
          boxShadow: { sm: '0 4px 6px rgba(0, 0, 0, 0.1)' },
          borderRadius: { sm: 2 },
          backgroundColor: 'background.paper',
        }}>
        <Grid
          container
          item
          xs={12}
          sm={7}
          md={6}
          direction='column'
          alignItems='center'
          justifyContent='center'
          sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography
            variant='h4'
            component='h1'
            textAlign='center'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 4,
            }}>
            {header}
          </Typography>
          {children}
          {bottomButton && (
            <Stack sx={{ width: '100%', mt: 1 }}>
              <Button href={bottomButton.target || '#'} sx={{ px: 3 }}>
                {bottomButton.text}
              </Button>
            </Stack>
          )}
        </Grid>

        {!isMobile && (
          <Grid item sm={5} md={6}>
            <Image
              src={banner}
              alt='Authentication banner'
              fit='cover'
              duration={0}
              sx={{
                height: '100%',
                borderRadius: { sm: '0 8px 8px 0' },
              }}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
