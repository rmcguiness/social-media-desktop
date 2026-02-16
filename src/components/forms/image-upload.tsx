'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { getAuthToken } from '@/app/actions/auth';

interface ImageUploadProps {
  label: string;
  currentImage?: string | null;
  onUpload: (url: string) => void;
  type: 'avatar' | 'cover';
  maxSizeMB?: number;
}

export function ImageUpload({ 
  label, 
  currentImage, 
  onUpload, 
  type,
  maxSizeMB = type === 'avatar' ? 5 : 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const formData = new FormData();
      formData.append('file', file);

      const endpoint = type === 'avatar' 
        ? '/api/profile/avatar' 
        : '/api/profile/cover';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = type === 'avatar' ? data.image : data.coverImage;
      
      onUpload(imageUrl);
      setPreview(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isAvatar = type === 'avatar';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          <Image
            src={preview}
            alt="Preview"
            width={isAvatar ? 120 : 400}
            height={isAvatar ? 120 : 133}
            className={`
              object-cover border-2 border-border
              ${isAvatar ? 'rounded-full' : 'rounded-lg'}
            `}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            disabled={uploading}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* File input */}
      <div>
        <label
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-border
            hover:border-accent hover:bg-accent/5 cursor-pointer transition-colors
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Upload size={18} />
          <span className="text-sm font-medium">
            {uploading ? 'Uploading...' : 'Choose Image'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="text-xs text-foreground-muted mt-1">
          Maximum file size: {maxSizeMB}MB
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Loading indicator */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Uploading and optimizing...</span>
        </div>
      )}
    </div>
  );
}
