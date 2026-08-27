import { useState, useEffect, useRef } from 'react';
import './Image.css';

/**
 * Universal Image Component for Vertex 7
 * Handles smooth loading animations, dark-industrial shimmer skeleton,
 * and elegant branded fallback UI on error/missing images (preventing broken PNG icons).
 */
export default function Image({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  aspectRatio,
  fit = 'cover',
  loading = 'lazy',
  fallbackText,
  showFallbackIcon = true,
  onClick,
  style,
  ...props
}) {
  const [status, setStatus] = useState(() => (!src ? 'error' : 'loading'));
  const imgRef = useRef(null);

  // Reset status when src changes
  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    // Check if the image is already cached/complete
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setStatus('loaded');
    } else {
      setStatus('loading');
    }
  }, [src]);

  const handleLoad = () => {
    setStatus('loaded');
  };

  const handleError = () => {
    setStatus('error');
  };

  const wrapStyle = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...style,
  };

  return (
    <div
      className={`v7-image-wrap ${status === 'loading' ? 'v7-image-wrap--loading' : ''} ${status === 'error' ? 'v7-image-wrap--error' : ''} ${status === 'loaded' ? 'v7-image-wrap--loaded' : ''} ${wrapperClassName}`}
      style={wrapStyle}
      onClick={onClick}
    >
      {/* Skeleton Shimmer Overlay */}
      {status === 'loading' && (
        <div className="v7-image-shimmer" aria-hidden="true">
          <div className="v7-image-shimmer__glow" />
          <div className="v7-image-shimmer__pulse-logo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>
      )}

      {/* Fallback View if image failed to load or src is empty */}
      {status === 'error' ? (
        <div className="v7-image-fallback" aria-label={alt || fallbackText || 'Image not available'}>
          <div className="v7-image-fallback__pattern" aria-hidden="true" />
          {showFallbackIcon && (
            <div className="v7-image-fallback__icon" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <circle cx="8" cy="8.5" r="1.5" />
                <path d="M21 13l-5-4l-7 7" />
              </svg>
            </div>
          )}
          <span className="v7-image-fallback__text">
            {fallbackText || alt || 'VERTEX 7'}
          </span>
          <span className="v7-image-fallback__tag">Heavy Equipment</span>
        </div>
      ) : (
        /* Actual Image Element */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`v7-image__img v7-image__img--fit-${fit} ${status === 'loaded' ? 'v7-image__img--loaded' : 'v7-image__img--hidden'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
}
