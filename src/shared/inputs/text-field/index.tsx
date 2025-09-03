import React from 'react';
import { TextField } from '@mui/material';

const CustomInput = ({
  placeholder,
  name,
  value,
  handleChange,
  handleBlur,
  error,
  ...props
}: any) => {
  return (
    <TextField
      {...{ placeholder, name, value, error }}
      fullWidth={true}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
};

CustomInput.displayName = 'CustomInput';

export default CustomInput;
