import { useState, useRef } from 'react';
import Image from '../ui/Image';
import { supabase } from '../../lib/supabase';
import ImageCropModal from './ImageCropModal';
import './ImageUpload.css';

export default function ImageUpload({
  bucket = 'images',
  folder = '',
  value = '',
  onChange,
  label = 'Upload Image',
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  enableCrop = true,
  defaultAspect = '16:10',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropSource, setCropSource] = useState(null); // File, Blob, or URL string
  const [savedRawFile, setSavedRawFile] = useState(null);
  const [currentOriginalUrl, setCurrentOriginalUrl] = useState('');

  const inputRef = useRef(null);

  // Helper to get candidate original URL if current URL is a cropped version
  function getOriginalCandidate(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('_crop.')) {
      return url.replace(/_crop\.[a-zA-Z0-9]+$/, (match) =>
        match.replace('_crop', '_orig')
      );
    }
    return url;
  }

  // Upload cropped image along with original raw image to Supabase
  async function uploadCroppedAndOriginal(croppedBlob, rawFileOrUrl) {
    setUploading(true);
    setError('');

    try {
      const baseId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const folderPrefix = folder ? `${folder}/` : '';

      let origUrl = currentOriginalUrl;

      // 1. If we have a fresh raw File/Blob, upload it as the uncropped original backup
      if (rawFileOrUrl instanceof File || rawFileOrUrl instanceof Blob) {
        const rawExt = rawFileOrUrl.name ? rawFileOrUrl.name.split('.').pop() : 'webp';
        const origFileName = `${folderPrefix}${baseId}_orig.${rawExt}`;

        const { error: origErr } = await supabase.storage
          .from(bucket)
          .upload(origFileName, rawFileOrUrl, {
            upsert: true,
            contentType: rawFileOrUrl.type || `image/${rawExt}`,
          });

        if (!origErr) {
          const { data: origData } = supabase.storage.from(bucket).getPublicUrl(origFileName);
          origUrl = origData?.publicUrl || '';
          setCurrentOriginalUrl(origUrl);
        }
      }

      // 2. Upload the newly cropped WebP image
      const cropFileName = `${folderPrefix}${baseId}_crop.webp`;
      const { error: cropErr } = await supabase.storage
        .from(bucket)
        .upload(cropFileName, croppedBlob, {
          upsert: true,
          contentType: 'image/webp',
        });

      if (cropErr) throw cropErr;

      const { data: cropData } = supabase.storage.from(bucket).getPublicUrl(cropFileName);
      onChange(cropData.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  // Direct upload without crop
  async function uploadSingleFile(file) {
    setUploading(true);
    setError('');

    try {
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
      setCurrentOriginalUrl(data.publicUrl);
      onChange(data.publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  // Handle new file selection
  function handleFileSelected(file) {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError('File must be under 15MB.');
      return;
    }

    setError('');
    setSavedRawFile(file);

    if (enableCrop) {
      setCropSource(file);
      setCropModalOpen(true);
    } else {
      uploadSingleFile(file);
    }
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  }

  // Drag & drop handlers
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  // Re-crop existing image (loads original uncropped photo so you can re-adjust without losing original)
  function handleOpenCropForExisting() {
    if (!value) return;

    // Use saved local file, or stored original URL, or derived original candidate, or current value
    const sourceToUse =
      savedRawFile ||
      currentOriginalUrl ||
      getOriginalCandidate(value) ||
      value;

    setCropSource(sourceToUse);
    setCropModalOpen(true);
  }

  // Crop completed in modal
  function handleCropComplete(croppedBlob) {
    setCropModalOpen(false);
    uploadCroppedAndOriginal(croppedBlob, cropSource);
  }

  // Skip crop in modal (uses original uncropped)
  function handleSkipCrop() {
    setCropModalOpen(false);
    if (savedRawFile) {
      uploadSingleFile(savedRawFile);
    }
  }

  function handleCloseCropModal() {
    setCropModalOpen(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleRemove() {
    onChange('');
    setSavedRawFile(null);
    setCurrentOriginalUrl('');
  }

  return (
    <div className="image-upload">
      {value ? (
        <div className="image-upload__preview-card">
          <div className="image-upload__preview-inner">
            <Image
              src={value}
              alt="Preview"
              className="image-upload__image"
              fallbackText="Preview Unavailable"
            />
            <div className="image-upload__overlay-actions">
              {enableCrop && (
                <button
                  type="button"
                  className="image-upload__action-btn image-upload__action-btn--crop"
                  onClick={handleOpenCropForExisting}
                  title="Adjust & Crop Image"
                  disabled={uploading}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                  </svg>
                  <span>Adjust / Crop</span>
                </button>
              )}
              <button
                type="button"
                className="image-upload__action-btn image-upload__action-btn--replace"
                onClick={() => inputRef.current?.click()}
                title="Replace image"
                disabled={uploading}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Replace</span>
              </button>
              <button
                type="button"
                className="image-upload__action-btn image-upload__action-btn--remove"
                onClick={handleRemove}
                title="Remove image"
                disabled={uploading}
              >
                ✕
              </button>
            </div>
          </div>
          {uploading && (
            <div className="image-upload__loading-overlay">
              <span className="image-upload__spinner" />
              <span>Uploading image...</span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={`image-upload__dropzone ${isDragOver ? 'image-upload__dropzone--active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="image-upload__spinner" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <div className="image-upload__icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="image-upload__primary-text">{label}</span>
              <span className="image-upload__sub-text">
                {enableCrop ? 'Click to browse or drop file • Cropping tool included' : 'Drag and drop or browse files'}
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="image-upload__input"
        tabIndex={-1}
      />

      {error && <span className="image-upload__error">{error}</span>}

      {/* Crop & Adjust Modal */}
      {cropModalOpen && cropSource && (
        <ImageCropModal
          imageSrc={cropSource}
          isOpen={cropModalOpen}
          onClose={handleCloseCropModal}
          onCropComplete={handleCropComplete}
          onSkipCrop={savedRawFile ? handleSkipCrop : null}
          defaultAspect={defaultAspect}
          title={savedRawFile ? 'Adjust & Crop New Cover Image' : 'Re-adjust Cover Image'}
        />
      )}
    </div>
  );
}
