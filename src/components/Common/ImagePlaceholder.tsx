'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/sanity/lib/image';

interface ImagePlaceholderProps {
  src?: any;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholder?: string;
  fallbackColor?: string;
  fallbackText?: string;
}

export default function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'Image',
  fallbackColor = 'from-primary/20 to-primary/40',
  fallbackText
}: ImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Se non c'è src o c'è un errore, mostra il placeholder
  if (!src || imageError) {
    return (
      <div 
        className={`bg-gradient-to-br ${fallbackColor} rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-primary text-sm font-bold">
          {fallbackText || placeholder}
        </span>
      </div>
    );
  }

  // Se c'è src, prova a renderizzare l'immagine
  const imageUrl = getImageUrl(src);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!imageLoaded && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${fallbackColor} rounded-lg flex items-center justify-center`}
        >
          <span className="text-primary text-sm font-bold">
            {fallbackText || placeholder}
          </span>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
