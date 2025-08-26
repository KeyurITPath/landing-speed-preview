import React from 'react';
import {
  FormHelperText,
  FormControl as MuiFormControl,
  Typography,
} from '@mui/material';
import CustomInput from './text-field';
import CustomPhoneInput from './phone-input';
import CheckboxGroup from './checkbox-group';
import Select from './select';
import Autocomplete from './auto-complete';

const FormControl = React.memo(
  ({
    color = 'primary',
    disabled = false,
    size = 'large',
    type = 'text',
    label,
    error,
    name,
    handleBlur,
    handleChange,
    options = [],
    listIcon = false,
    renderSelectedValue,
    mainSx,
    helperText,
    ...props
  }: any) => {
    const isError = Boolean(error);

    // Remove renderSelectedValue from props passed to MuiFormControl
    const restProps = { ...props, sx: { ...mainSx, ...props.sx } };
    delete restProps.renderSelectedValue;
    // Remove mainSx from restProps so it is not passed to DOM
    delete restProps.mainSx;
    return (
      <MuiFormControl
        {...{ color, disabled, size }}
        error={isError}
        {...restProps}
      >
        {label && (
          <Typography variant='body2' sx={{ mb: '3px' }}>
            {label}
          </Typography>
        )}
        {type === 'phone' ? (
          <CustomPhoneInput
            {...{ name, color, disabled, size, handleBlur, handleChange }}
            error={isError}
            {...props}
          />
        ) : type === 'select' ? (
          <Select
            {...{
              name,
              color,
              disabled,
              size,
              handleBlur,
              listIcon,
              handleChange,
              options,
            }}
            {...restProps}
            {...(renderSelectedValue ? { renderSelectedValue } : {})}
          />
        ) : type === 'autocomplete' ? (
          <Autocomplete
            {...{
              name,
              color,
              disabled,
              size,
              handleBlur,
              handleChange,
              options,
            }}
            error={isError}
            {...props}
          />
        ) : type === 'radio' ? (
          <CheckboxGroup
            {...{
              name,
              color,
              disabled,
              size,
              handleBlur,
              handleChange,
              options,
            }}
            {...props}
          />
        ) : (
          <CustomInput
            {...{ name, color, disabled, size, handleBlur, handleChange, type }}
            error={isError}
            {...props}
          />
        )}

        {(isError || helperText) && (
          <FormHelperText id={name}>
            {isError ? error : helperText}
          </FormHelperText>
        )}
      </MuiFormControl>
    );
  }
);

FormControl.displayName = 'FormControl';

export default FormControl;
