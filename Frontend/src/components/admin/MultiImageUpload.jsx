import { useState, useRef } from 'react';
import Image from '../ui/Image';
import { supabase } from '../../lib/supabase';
import ImageCropModal from './ImageCropModal';
import './MultiImageUpload.css';

export default function MultiImageUpload({
  bucket = 'images',
  folder = 'projects',
  images = [],
  onChange,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxFileSizeMB = 15,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Gallery item crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropIndex, setCropIndex] = useState(null);
  const [cropSource, setCropSource] = useState(null);
  const [originalsMap, setOriginalsMap] = useState({});

  const inputRef = useRef(null);

  // Helper to derive original URL if already cropped
  function getOriginalCandidate(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('_crop.')) {
      return url.replace(/_crop\.[a-zA-Z0-9]+$/, (match) =>
        match.replace('_crop', '_orig')
      );
    }
    return url;
  }

  // Upload single file helper
  async function uploadFile(file) {
    const ext = file.name ? file.name.split('.').pop() : 'webp';
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: false,
        contentType: file.type || `image/${ext}`,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  // Handle batch files selection (multiple files)
  async function handleBatchFiles(filesList) {
    const files = Array.from(filesList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;

    // Validate sizes
    const oversized = files.filter((f) => f.size > maxFileSizeMB * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`Some files exceeded the ${maxFileSizeMB}MB limit and were skipped.`);
    } else {
      setError('');
    }

    const validFiles = files.filter((f) => f.size <= maxFileSizeMB * 1024 * 1024);
    if (!validFiles.length) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    const newUrls = [];
    const newMap = { ...originalsMap };
    let completedCount = 0;

    for (const file of validFiles) {
      try {
        const publicUrl = await uploadFile(file);
        newUrls.push(publicUrl);
        newMap[publicUrl] = publicUrl; // Raw original URL
      } catch (err) {
        console.error('Failed to upload file:', file.name, err);
        setError((prev) => (prev ? `${prev} Failed to upload ${file.name}.` : `Failed to upload ${file.name}.`));
      } finally {
        completedCount++;
        setUploadProgress({ current: completedCount, total: validFiles.length });
      }
    }

    setUploading(false);
    setOriginalsMap(newMap);
    if (inputRef.current) inputRef.current.value = '';

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
  }

  function handleInputChange(e) {
    if (e.target.files?.length) {
      handleBatchFiles(e.target.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) {
      handleBatchFiles(e.dataTransfer.files);
    }
  }

  // Gallery Item Actions
  function handleRemove(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleMoveLeft(index) {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  }

  function handleMoveRight(index) {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  }

  function handleOpenCrop(index) {
    const currentUrl = images[index];
    // Find uncropped original if available
    const sourceToUse =
      originalsMap[currentUrl] ||
      getOriginalCandidate(currentUrl) ||
      currentUrl;

    setCropIndex(index);
    setCropSource(sourceToUse);
    setCropModalOpen(true);
  }

  // Handle crop completion for a specific gallery image
  async function handleGalleryCropComplete(croppedBlob) {
    setCropModalOpen(false);
    if (cropIndex === null) return;

    setUploading(true);
    setError('');

    try {
      const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const cropFileName = `${folder ? folder + '/' : ''}${baseId}_crop.webp`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(cropFileName, croppedBlob, {
          upsert: true,
          contentType: 'image/webp',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(cropFileName);
      const newUrl = data.publicUrl;

      // Update gallery
      const updated = [...images];
      updated[cropIndex] = newUrl;
      onChange(updated);

      // Preserve original mapping for future re-crops
      setOriginalsMap((prev) => ({
        ...prev,
        [newUrl]: cropSource,
      }));
    } catch (err) {
      console.error('Failed to upload cropped image:', err);
      setError('Failed to upload cropped gallery image.');
    } finally {
      setUploading(false);
      setCropIndex(null);
      setCropSource(null);
    }
  }

  function handleClearAll() {
    if (window.confirm('Are you sure you want to remove all gallery images?')) {
      onChange([]);
    }
  }

  return (
    <div className="multi-image-upload">
      {/* Existing Gallery Grid */}
      {images.length > 0 && (
        <div className="multi-image-upload__gallery-header">
          <span className="multi-image-upload__count-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span>{images.length} {images.length === 1 ? 'Image' : 'Images'}</span>
          </span>
          <button
            type="button"
            className="multi-image-upload__clear-btn"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="multi-image-upload__grid">
          {images.map((url, i) => (
            <div key={i} className="multi-image-upload__item">
              <div className="multi-image-upload__thumb-wrap">
                <Image
                  src={url}
                  alt={`Gallery photo ${i + 1}`}
                  className="multi-image-upload__thumb"
                  fallbackText={`#${i + 1}`}
                />
                <span className="multi-image-upload__index-pill">#{i + 1}</span>

                <div className="multi-image-upload__item-overlay">
                  {/* Reorder Buttons */}
                  <div className="multi-image-upload__reorder-group">
                    <button
                      type="button"
                      className="multi-image-upload__icon-btn"
                      onClick={() => handleMoveLeft(i)}
                      disabled={i === 0}
                      title="Move left"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="multi-image-upload__icon-btn"
                      onClick={() => handleMoveRight(i)}
                      disabled={i === images.length - 1}
                      title="Move right"
                    >
                      →
                    </button>
                  </div>

                  {/* Crop & Remove Actions */}
                  <div className="multi-image-upload__action-group">
                    <button
                      type="button"
                      className="multi-image-upload__icon-btn multi-image-upload__icon-btn--crop"
                      onClick={() => handleOpenCrop(i)}
                      title="Adjust / Crop this image"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="multi-image-upload__icon-btn multi-image-upload__icon-btn--remove"
                      onClick={() => handleRemove(i)}
                      title="Delete image"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-file Dropzone */}
      <div
        className={`multi-image-upload__dropzone ${isDragOver ? 'multi-image-upload__dropzone--active' : ''
          }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="multi-image-upload__progress-wrap">
            <span className="multi-image-upload__spinner" />
            <span className="multi-image-upload__progress-text">
              Uploading images ({uploadProgress.current} / {uploadProgress.total})...
            </span>
            <div className="multi-image-upload__progress-bar">
              <div
                className="multi-image-upload__progress-fill"
                style={{
                  width: `${uploadProgress.total > 0
                      ? (uploadProgress.current / uploadProgress.total) * 100
                      : 0
                    }%`,
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="multi-image-upload__icon-box">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                <path d="M12 8v4m0 0v4m0-4h4m-4 0H8" strokeWidth="2" />
              </svg>
            </div>
            <div className="multi-image-upload__dropzone-text">
              <span className="multi-image-upload__main-label">
                {images.length > 0 ? '+ Add More Images ' : 'Upload Images'}
              </span>
              <span className="multi-image-upload__sub-label">
                Select multiple files at once or drag and drop images here (PNG, JPG, WebP)
              </span>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleInputChange}
        className="multi-image-upload__input"
        tabIndex={-1}
      />

      {error && <span className="multi-image-upload__error">{error}</span>}

      {/* Gallery Crop Modal */}
      {cropModalOpen && cropSource && (
        <ImageCropModal
          imageSrc={cropSource}
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setCropIndex(null);
            setCropSource(null);
          }}
          onCropComplete={handleGalleryCropComplete}
          defaultAspect="16:10"
          title={`Adjust & Crop Gallery Image #${(cropIndex ?? 0) + 1}`}
        />
      )}
    </div>
  );
}
