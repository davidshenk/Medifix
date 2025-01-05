import { TextField } from '@mui/material';
import { isFunction } from '../../utils/dataTypeHelper';
import { useState } from 'react';

const ValidationInput = ({ value, setValue, error, ...props }) => {
  const [wasFocusedOut, setWasFocusedOut] = useState(false);

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={wasFocusedOut && (isFunction(error) ? error(value) : false)}
      onBlur={() => setWasFocusedOut(true)}
      {...props}></TextField>
  );
};

export default ValidationInput;
