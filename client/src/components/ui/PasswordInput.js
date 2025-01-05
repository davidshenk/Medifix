import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ValidationInput from './ValidationInput';
import { isNotValidPassword } from '../../utils/validation';

const PasswordInput = ({ value, setValue }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <ValidationInput
      label='Password'
      type={isVisible ? 'text' : 'password'}
      required
      error={isNotValidPassword}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={() => setIsVisible((prev) => !prev)}>
              {isVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}></ValidationInput>
  );
};

export default PasswordInput;
