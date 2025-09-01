"use client";

import { Box, Stack } from "@mui/material";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";
import { IMAGES } from "../../assets/images";

type Props = {
  src: any;
  alt: string;
  sx?: object;
  containerSx?: object;
  aspectRatio?: string;
  borderRadius?: number;
  disableBgColor?: boolean;
} & Omit<NextImageProps, "src" | "alt">;

export default function CustomImage({
  src,
  alt,
  sx,
  containerSx,
  aspectRatio = "16/9",
  borderRadius = 1,
  disableBgColor = false,
  ...props
}: Props) {
  const [hasError, setHasError] = useState(false);

  return (
    <Stack
      sx={{
        aspectRatio,
        borderRadius,
        width: "100%",
        overflow: "hidden",
        bgcolor: disableBgColor
          ? "transparent"
          : (theme) => theme.palette.grey[200],
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // required for fill
        ...containerSx,
      }}
    >
      {/* Error fallback */}
      {hasError && (
        <Box
          component="img"
          src={IMAGES.imagePlaceholder}
          alt="imagePlaceholder"
          sx={{
            width: "auto",
            height: "78%",
            objectFit: "contain",
          }}
        />
      )}

      {!hasError && (
        <NextImage
          src={src}
          alt={alt}
          fill
          onError={() => setHasError(true)}
          style={{
            objectFit: "cover",
            display: hasError ? "none" : "block",
            ...sx,
          }}
          {...props}
        />
      )}
    </Stack>
  );
}
