import ValidationInput from './ValidationInput';
import { isNotValidEmail } from '../../utils/validation';

const EmailInput = ({ value, setValue }) => {
  return (
    <ValidationInput
      label='Email Address'
      type='text'
      required
      error={isNotValidEmail}
      value={value}
      onChange={(e) => setValue(e.target.value)}></ValidationInput>
  );
};

export default EmailInput;
