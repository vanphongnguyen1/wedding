'use client';
 
import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';
 
interface Props extends ImageProps {
  animationDuration?: number; // ms
  delay?: number; // ms
  isLayzy?: boolean;
}
 
export const ImageLoading = ({
  animationDuration = 600,
  delay = 80,
  alt = '',
  className,
  isLayzy = true,
  src,
  style,
  ...props
}: Props) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
 
  const [loaded, setLoaded] = useState(false);
 
  // fallback khi ảnh load từ cache (onLoad không fire)
  useEffect(() => {
    if (!isLayzy) return;
 
    if (src && typeof src === 'string') {
      const img = new window.Image();
      img.src = src;
 
      if (img.complete) {
        timeoutRef.current = setTimeout(() => setLoaded(true), delay);
      }
    }
 
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [src, delay, isLayzy]);
 
  const handleLoad = () => {
    if (!isLayzy) return;
    timeoutRef.current = setTimeout(() => setLoaded(true), delay);
  };
 
  return (
    <Image
      {...props}
      alt={alt}
      src={src}
      onLoad={handleLoad}
      className={`
        transition-all ease-out
        ${
          loaded || !isLayzy
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-60 blur-xl scale-[1.03]'
        }
       ${className}`}
      style={{
        transitionDuration: `${animationDuration}ms`,
        ...style,
      }}
    />
  );
};