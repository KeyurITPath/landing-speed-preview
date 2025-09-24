import React from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';

const CustomInput = ({
  placeholder,
  name,
  value,
  handleChange,
  handleBlur,
  error,
  ...props
}: any) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  return (
    <TextField
      {...{ placeholder, name, value, error }}
      {...props}
      fullWidth={true}
      onChange={handleChange}
      onBlur={handleBlur}
      slotProps={{
        input: {
          ...(props?.type === 'password' ? {
            endAdornment: <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  edge="start"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </IconButton>
            </InputAdornment>
          } : { endAdornment: props?.endAdornment || null }),
        }
      }}
      type={
        props?.type === 'password'
          ? showPassword
            ? 'text'
            : 'password'
          : props?.type
      }
    />
  );
};

CustomInput.displayName = 'CustomInput';

export default CustomInput;
