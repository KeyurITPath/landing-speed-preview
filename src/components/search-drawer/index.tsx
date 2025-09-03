import { Drawer, IconButton, InputAdornment, Stack } from '@mui/material';
import React from 'react';
import CustomInput from '@/shared/inputs/text-field';
import { useTranslations } from 'next-intl';
import { ICONS } from '@/assets/icons';

const SearchDrawer = ({
  open,
  handleClose,
  inputRef,
  searchTerm,
  handleSearchChange,
  handleIconClick,
}: any) => {
  const t = useTranslations();

  return (
    <Drawer anchor={'top'} open={open} onClose={handleClose} hideBackdrop>
      <Stack
        minHeight={60}
        direction='row'
        gap={1}
        justifyContent='space-between'
        alignItems='center'
        px={2}
      >
        <CustomInput
          inputRef={inputRef}
          placeholder={t('search')}
          size='small'
          value={searchTerm}
          handleChange={handleSearchChange}
          slotProps={{
            input: {
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // prevent default form submit
                  handleIconClick();
                }
              },
              endAdornment: (
                <InputAdornment
                  onClick={handleIconClick}
                  position='end'
                  sx={{
                    color: '#808080',
                    fontSize: 20,
                    cursor: 'pointer',
                  }}
                >
                  <ICONS.SEARCH />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: '100%' },
            '.MuiInputBase-root': {
              bgcolor: '#F5F5F5',
              borderRadius: '33px',
              border: 'none',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            input: {
              pl: 2,
              pr: 0,
              py: 0.8,
            },
          }}
        />
        <IconButton onClick={handleClose}>
          <ICONS.CLOSE size={20} />
        </IconButton>
      </Stack>
    </Drawer>
  );
};

export default SearchDrawer;
