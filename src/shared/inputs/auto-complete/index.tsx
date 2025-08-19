import {
  Autocomplete as MuiAutocomplete,
  Radio,
  TextField,
} from '@mui/material';

const Autocomplete = ({
  placeholder,
  name,
  value,
  handleChange,
  handleBlur,
  error,
  options,
  ...props
}: any) => {
  return (
    <MuiAutocomplete
      {...{ options }}
      value={options?.find((option: any) => option?.value === value) || null}
      defaultValue={null}
      disablePortal
      renderInput={params => (
        <TextField {...params} {...{ placeholder, name, error }} />
      )}
      onChange={(_, newValue: any) => {
        handleChange({ target: { name, value: newValue?.value || null } });
      }}
      onBlur={handleBlur}
      renderOption={(props, option, { selected }: any) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Radio
              disableRipple
              checked={selected}
              inputProps={{ 'aria-label': option.label }}
              sx={{ py: 0.5, ml: -0.5, pr: 1, pl: 0, color: 'primary.main' }}
            />
            {option.label}
          </li>
        );
      }}
      slotProps={{
        paper: { elevation: 5 },
        listbox: { className: 'custom-scrollbar' },
      }}
      {...props}
    />
  );
};

export default Autocomplete;
