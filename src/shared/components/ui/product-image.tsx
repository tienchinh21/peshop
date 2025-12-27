"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ProductImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function ProductImage({
  src,
  alt,
  fallbackSrc = "/placeholder-product.svg",
  ...props
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const isExternal =
    typeof imgSrc === "string" &&
    (imgSrc.startsWith("http://") || imgSrc.startsWith("https://"));

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc || fallbackSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      unoptimized={isExternal}
    />
  );
}
