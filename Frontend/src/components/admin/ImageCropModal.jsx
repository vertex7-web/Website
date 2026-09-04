import { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../lib/cropImage';
import './ImageCropModal.css';

const ASPECT_RATIOS = [
  { label: '4:3 (Machinery / Standard)', value: 4 / 3, key: '4:3' },
  { label: '16:10 (Projects / Card)', value: 16 / 10, key: '16:10' },
  { label: '16:9 (Hero Banner)', value: 16 / 9, key: '16:9' },
  { label: '1:1 (Square)', value: 1, key: '1:1' },
  { label: 'Original', value: null, key: 'original' },
];

export default function ImageCropModal({
  imageSrc, // File object, Blob, or URL string (the original raw image)
  isOpen,
  onClose,
  onCropComplete,
  onSkipCrop,
  defaultAspect = '16:10',
  title = 'Adjust & Crop Image',
}) {
  const [imgUrl, setImgUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspectKey, setAspectKey] = useState(defaultAspect);
  const [naturalAspect, setNaturalAspect] = useState(16 / 10);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize or update image source
  useEffect(() => {
    if (!imageSrc) {
      setImgUrl('');
      return;
    }

    let url = '';
    if (imageSrc instanceof File || imageSrc instanceof Blob) {
      url = URL.createObjectURL(imageSrc);
      setImgUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof imageSrc === 'string') {
      setImgUrl(imageSrc);
    }
  }, [imageSrc]);

  // Reset transforms when modal opens
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setAspectKey(defaultAspect);
    }
  }, [isOpen, defaultAspect]);

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const onCropCompleteCallback = useCallback((_croppedArea, currentCroppedAreaPixels) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const onMediaLoaded = (mediaSize) => {
    if (mediaSize.naturalWidth && mediaSize.naturalHeight) {
      setNaturalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
    }
  };

  // Get active aspect ratio
  const activeAspectConfig = ASPECT_RATIOS.find((r) => r.key === aspectKey);
  const activeAspect =
    activeAspectConfig && activeAspectConfig.value !== null
      ? activeAspectConfig.value
      : naturalAspect;

  const handleRotate = (degrees) => {
    setRotation((prev) => (prev + degrees + 360) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectKey(defaultAspect);
  };

  const handleApplyCrop = async () => {
    if (!imgUrl || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImg(
        imgUrl,
        croppedAreaPixels,
        rotation,
        { horizontal: flipH, vertical: flipV }
      );

      setIsProcessing(false);
      if (croppedBlob) {
        onCropComplete(croppedBlob);
      } else {
        throw new Error('Could not crop image.');
      }
    } catch (err) {
      console.error('Crop failed:', err);
      setIsProcessing(false);
      if (onSkipCrop) {
        onSkipCrop();
      }
    }
  };

  if (!isOpen || !imgUrl) return null;

  return (
    <div className="crop-modal-backdrop" onClick={onClose}>
      <div
        className="crop-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
      >
        {/* Header */}
        <div className="crop-modal__header">
          <div className="crop-modal__title-wrap">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="crop-modal__title-icon"
            >
              <path d="M6 2v14a2 2 0 0 0 2 2h14" />
              <path d="M18 22V8a2 2 0 0 0-2-2H2" />
            </svg>
            <h2 id="crop-modal-title" className="crop-modal__title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="crop-modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="crop-modal__aspect-bar">
          <span className="crop-modal__bar-label">Aspect Ratio:</span>
          <div className="crop-modal__aspect-pills">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.key}
                type="button"
                className={`crop-modal__aspect-btn ${aspectKey === ratio.key ? 'crop-modal__aspect-btn--active' : ''
                  }`}
                onClick={() => {
                  setAspectKey(ratio.key);
                  setCrop({ x: 0, y: 0 });
                }}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Area with react-easy-crop */}
        <div className="crop-modal__viewport-area">
          <div className="crop-modal__cropper-container">
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              aspect={activeAspect}
              rotation={rotation}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteCallback}
              onZoomChange={onZoomChange}
              onMediaLoaded={onMediaLoaded}
              showGrid={true}
              classes={{
                containerClassName: 'crop-modal__easy-container',
                mediaClassName: 'crop-modal__easy-media',
                cropAreaClassName: 'crop-modal__easy-crop-area',
              }}
              style={{
                mediaStyle: {
                  transform: `scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                },
              }}
            />
          </div>
          <div className="crop-modal__hint">
            <span>💡 Drag to reposition • Pinch or scroll to zoom</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="crop-modal__toolbar">
          {/* Zoom Slider */}
          <div className="crop-modal__control-group">
            <span className="crop-modal__control-label">
              Zoom: {Math.round(zoom * 100)}%
            </span>
            <div className="crop-modal__slider-row">
              <button
                type="button"
                className="crop-modal__icon-btn"
                onClick={() => setZoom((z) => Math.max(z - 0.1, 1))}
                title="Zoom Out"
              >
                −
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="crop-modal__slider"
              />
              <button
                type="button"
                className="crop-modal__icon-btn"
                onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>

          {/* Transform Buttons */}
          <div className="crop-modal__transform-actions">
            <button
              type="button"
              className="crop-modal__action-btn"
              onClick={() => handleRotate(-90)}
              title="Rotate 90° Counter-Clockwise"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>-90°</span>
            </button>

            <button
              type="button"
              className="crop-modal__action-btn"
              onClick={() => handleRotate(90)}
              title="Rotate 90° Clockwise"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              <span>+90°</span>
            </button>

            <button
              type="button"
              className={`crop-modal__action-btn ${flipH ? 'crop-modal__action-btn--active' : ''}`}
              onClick={() => setFlipH((prev) => !prev)}
              title="Flip Horizontal"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 7 5 5-5 5V7z" />
                <path d="m21 7-5 5 5 5V7z" />
                <path d="M12 4v16" />
              </svg>
              <span>Flip H</span>
            </button>

            <button
              type="button"
              className={`crop-modal__action-btn ${flipV ? 'crop-modal__action-btn--active' : ''}`}
              onClick={() => setFlipV((prev) => !prev)}
              title="Flip Vertical"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m7 3 5 5 5-5H7z" />
                <path d="m7 21 5-5 5 5H7z" />
                <path d="M4 12h16" />
              </svg>
              <span>Flip V</span>
            </button>

            <button
              type="button"
              className="crop-modal__action-btn crop-modal__action-btn--reset"
              onClick={handleReset}
              title="Reset adjustments"
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="crop-modal__footer">
          {onSkipCrop && (
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={onSkipCrop}
              disabled={isProcessing}
            >
              Use Original
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleApplyCrop}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
