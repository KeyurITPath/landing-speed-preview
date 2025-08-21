import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { IMAGES } from '@assets/images';

interface ImageProps {
  src: string;
  alt?: string;
  sx?: object;
  containerSx?: object;
  aspectRatio?: string;
  borderRadius?: number;
  disableBgColor?: boolean;
  [key: string]: any;
}

const Image = ({
  src,
  alt,
  sx,
  containerSx,
  aspectRatio = '16/9',
  borderRadius = 1,
  disableBgColor = false,
  ...props
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Stack
      sx={{
        aspectRatio,
        borderRadius,
        width: '100%',
        overflow: 'hidden',
        bgcolor: disableBgColor
          ? 'transparent'
          : theme => theme.palette.grey[200],
        justifyContent: 'center',
        alignItems: 'center',
        ...containerSx,
      }}
    >
      {hasError && (
        <Box
          component='img'
          src={
            typeof IMAGES.imagePlaceholder === 'string'
              ? IMAGES.imagePlaceholder
              : IMAGES.imagePlaceholder.src
          }
          alt='imagePlaceholder'
          sx={{ width: 'auto', height: '78%', objectFit: 'contain' }}
        />
      )}
      <Box
        component='img'
        {...{ src, alt }}
        sx={{
          height: '100%',
          width: '100%',
          display: isLoaded ? 'block' : 'none',
          objectFit: 'cover',
          ...sx,
        }}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={(error) => {
          console.log('error', error)
          setHasError(true);
        }}
        {...props}
      />
    </Stack>
  );
};

export default Image;
