import React from 'react';

/**
 * Photo with WebP versions for modern browsers. Every JPEG under /public has
 * <name>-800.webp and <name>-1600.webp siblings (see scripts/optimize-images.mjs);
 * the original JPEG stays as the fallback and for social-share previews.
 */
export const webpSrcSet = (src: string) => {
  const base = src.replace(/\.jpe?g$/i, '');
  return `${base}-800.webp 800w, ${base}-1600.webp 1600w`;
};

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  sizes?: string;
};

export default function Picture({ src, sizes = '100vw', loading = 'lazy', alt = '', ...img }: Props) {
  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet(src)} sizes={sizes} />
      <img src={src} alt={alt} loading={loading} decoding="async" {...img} />
    </picture>
  );
}
