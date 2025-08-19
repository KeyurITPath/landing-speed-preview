import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

const CheckboxGroup = ({
  name,
  value,
  handleChange,
  handleBlur,
  error,
  options,
  ...props
}: any) => {
  return (
    <RadioGroup
      {...{ name, value, error }}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    >
      {options.map(({ value, label }: any) => (
        <FormControlLabel
          key={value}
          {...{ value, label }}
          control={<Radio />}
        />
      ))}
    </RadioGroup>
  );
};

export default CheckboxGroup;
