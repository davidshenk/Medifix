import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Divider } from '@mui/material';
import AuthLayout from '../../../layouts/AuthLayout';
import { useAlert } from '../../../context/AlertContext';
import { useAuth } from '..';
import { useLocation, useNavigate } from 'react-router-dom';
import { EmailInput, PasswordInput } from '../../../components/ui';

const RegisterForm = () => {
  const { register } = useAuth();
  const { displayAlert } = useAlert();
  const [errorMessage, setErrorMessage] = useState();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/login';

  const handleSubmit = async (event) => {
    event.preventDefault();

    const registerObj = {
      userType: 1,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber: phone,
    };

    const { isSuccess, error } = await register(registerObj);
    setErrorMessage(error);

    isSuccess && navigate(from, { replace: true });
  };

  useEffect(() => {
    errorMessage && displayAlert(errorMessage);
  }, [displayAlert, errorMessage]);

  return (
    <AuthLayout header="Register Form" bottomButton={{ text: 'Login', target: '/login' }}>
      <Stack minWidth="100%" gap={2} sx={{ marginTop: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack gap={2}>
            <TextField
              label="First Name"
              type="text"
              required
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              type="text"
              required
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Phone"
              type="tel"
              required
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <EmailInput value={email} setValue={setEmail} />
            <PasswordInput value={password} setValue={setPassword} />
            <PasswordInput value={confirmPassword} setValue={setConfirmPassword} label="Confirm Password" />
            <Button type="submit" variant="contained" size="large" fullWidth>
              Register
            </Button>
          </Stack>
        </form>
        <Divider>or</Divider>
      </Stack>
    </AuthLayout>
  );
};

export default RegisterForm;