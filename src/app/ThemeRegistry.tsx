'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '../theme';
import createEmotionCache from '../createEmotionCache';
import EmotionRegistry from './EmotionRegistry';
import { CacheProvider, EmotionCache } from '@emotion/react';

const clientSideEmotionCache = createEmotionCache();

const theme = createTheme();

export interface ThemeRegistryProps {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
}

export default function ThemeRegistry({
  children,
  emotionCache = clientSideEmotionCache,
}: ThemeRegistryProps) {
  return (
    <EmotionRegistry>
      {/* <CacheProvider value={emotionCache}> */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      {/* </CacheProvider> */}
    </EmotionRegistry>
  );
}
