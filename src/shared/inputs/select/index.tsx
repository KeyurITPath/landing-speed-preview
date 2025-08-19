import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select as MuiSelect,
  Radio,
} from '@mui/material';

const Select = ({
  placeholder,
  name,
  value,
  handleChange,
  handleBlur,
  options,
  listIcon,
  renderSelectedValue,
  ...props
}: any) => {
  return (
    <MuiSelect
      {...{ name, value }}
      displayEmpty={true}
      onChange={handleChange}
      onBlur={handleBlur}
      renderValue={(selected: any) => {
        if (selected.length === 0) {
          return (
            <Box component='span' sx={{ color: '#96999f' }}>
              {placeholder}
            </Box>
          );
        }

        // Use custom render function if provided
        if (renderSelectedValue) {
          return renderSelectedValue(selected);
        }

        return selected;
      }}
      MenuProps={{ disableScrollLock: true }}
      {...props}
    >
      {options.map(({ value: optionValue, label, icon }: any) => (
        <MenuItem
          key={optionValue}
          value={optionValue}
          sx={{ gap: listIcon ? 1 : 0 }}
        >
          {icon && (
            <ListItemIcon sx={{ p: 0, m: 0, minWidth: '28px !important' }}>
              {icon}
            </ListItemIcon>
          )}
          {listIcon && (
            <ListItemIcon sx={{ p: 0, m: 0, minWidth: '28px !important' }}>
              <Radio
                disableRipple
                checked={optionValue === value}
                inputProps={{ 'aria-label': label }}
                sx={{ p: 0 }}
              />
            </ListItemIcon>
          )}
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export default Select;
