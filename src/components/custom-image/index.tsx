import Image from "next/image";

export default function CustomImage({
  src,
  alt,
  aspectRatio,
  borderRadius,
  containerSx = {},
}: {
  src: any;
  alt: string;
  aspectRatio?: string;
  borderRadius?: number;
  containerSx?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        ...containerSx,
        aspectRatio: aspectRatio ?? "auto",
        borderRadius: borderRadius ? `${borderRadius * 4}px` : undefined, // matches MUI spacing scale
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
