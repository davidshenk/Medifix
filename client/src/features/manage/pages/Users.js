import React from 'react';
import {
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Divider,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import useApiClient from '../../../api';
import { useForm } from 'react-hook-form';
import { useAlert } from '../../../context/AlertContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { DevTool } from '@hookform/devtools';
import { isValidEmail, isValidPassword } from '../../../utils/validation';

const required = 'Required';

const userTypeEnum = [
  { name: 'Client', id: 1 },
  { name: 'Manager', id: 2 },
  { name: 'Practitioner', id: 3 },
];

const Users = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { displayAlert } = useAlert();

  const onSubmit = async (user) => {
    user = { ...user, confirmPassword: user.password };
    const { isSuccess, error } = await apiClient.post('Account/register', user);
    isSuccess ? navigate(from, { replace: true }) : displayAlert(error);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: { xs: 2, md: 4 }, marginY: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom marginBottom={5} align="center">
          New user
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                {...register('firstName', { required })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Lase Name"
                {...register('lastName', { required })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Email address"
                {...register('email', { required, validate: isValidEmail })}
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message || (!!errors.email && 'Invalid email address')}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone number"
                {...register('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label="Type" {...register('userType', { required })} defaultValue={1} errors={errors}>
                  {userTypeEnum.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{errors['userType']?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                type="password"
                {...register('password', { required, validate: isValidPassword })}
                error={!!errors.password}
                helperText={errors.password?.message || (!!errors.password && 'Invalid password')}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  // disabled={!isValid}
                  sx={{ minWidth: 120 }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <DevTool control={control} placement="top-left"></DevTool>
    </Container>
  );
};
export default Users;
