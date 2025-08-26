import { useCallback } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material';
import { OVERRIDE } from '@/theme/basic';
import { linearGradients } from '@/theme/color';

const NavLink = styled(ListItemButton)(() => ({
  borderRadius: 3,
  ...OVERRIDE({}).FLEX,
}));

const NavItem = ({
  sx,
  title,
  isProfileActive,
  path,
  icon: ICON,
  isActiveKey,
  handleProfileClick,
  handleClick,
  isActive,
  mainIconSx = {},
  id,
}: any) => {
  const isActiveLink = useCallback(
    (isActiveKey: any) => {
      if (typeof isActive === 'function') {
        return isActive(isActiveKey);
      } else return false;
    },
    [isActive]
  );

  return (
    <ListItem sx={{ my: 0 }} disablePadding>
      <NavLink
        sx={{
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 1.2,
          ...sx,
          background:
            isProfileActive || isActiveLink(isActiveKey)
              ? linearGradients.primary
              : 'transparent',
          '&:hover': {
            background:
              isProfileActive || isActiveLink(isActiveKey)
                ? linearGradients.primary
                : '#FFFFFF14',
          },
        }}
        id={id}
        onClick={e =>
          handleProfileClick ? handleProfileClick(id) : handleClick(e, path, id)
        }
      >
        <ListItemIcon
          sx={{
            color:
              isProfileActive || isActiveLink(isActiveKey)
                ? 'initial.white'
                : 'rgba(14, 14, 14, 0.5)',
            fontSize: 24,
            fontWeight: isActiveLink(isActiveKey) ? 700 : 400,
            minWidth: 'unset',
            ...mainIconSx,
          }}
        >
          <ICON />
        </ListItemIcon>
        <ListItemText
          secondary={title}
          secondaryTypographyProps={{
            marginLeft: '12px',
            fontSize: 16,
            fontWeight: isActiveLink(isActiveKey) ? 700 : 400,
            color:
              isProfileActive || isActiveLink(isActiveKey)
                ? 'initial.white'
                : 'rgba(14, 14, 14, 0.5)',
          }}
          sx={{ mb: '0px' }}
        />
      </NavLink>
    </ListItem>
  );
};

export default NavItem;
