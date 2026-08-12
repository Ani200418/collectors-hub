import React, { useState } from 'react';
import './LazyImage.css';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  fallbackSrc, 
  className = '', 
  aspectRatio = '1/1',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  const displaySrc = error && fallbackSrc ? fallbackSrc : src;

  return (
    <div 
      className={`lazy-image ${loaded ? 'lazy-image--loaded' : ''} ${className}`}
      style={{ aspectRatio }}
    >
      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className="lazy-image__img"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
