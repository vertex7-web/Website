import { useState, useRef } from 'react';
import Image from '../ui/Image';
import { supabase } from '../../lib/supabase';
import './ImageUpload.css';

export default function ImageUpload({
  bucket = 'images',
  folder = '',
  value = '',
  onChange,
  label = 'Upload Image',
  accept = 'image/jpeg,image/png,image/webp',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div className="image-upload">
      {value ? (
        <div className="image-upload__preview">
          <Image
            src={value}
            alt="Preview"
            className="image-upload__image"
            fallbackText="Preview Unavailable"
          />
          <button
            type="button"
            className="image-upload__remove"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="image-upload__dropzone"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="image-upload__spinner" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{label}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="image-upload__input"
        tabIndex={-1}
      />

      {error && <span className="image-upload__error">{error}</span>}
    </div>
  );
}
