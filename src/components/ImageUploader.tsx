import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, X } from 'lucide-react';
import { uploadImageFile } from '../lib/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Image from Device',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image size exceeds 15MB limit.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold text-stone-700 tracking-wider uppercase">{label}</label>}

      <div className="flex items-start gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0 group shadow-sm">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              id="btn-remove-image"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center text-stone-400 flex-shrink-0">
            <ImageIcon className="w-7 h-7 stroke-1" />
            <span className="text-[10px] mt-1 font-medium text-stone-400">No Image</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="device-image-file-input"
          />

          <button
            type="button"
            id="btn-select-device-image"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium tracking-wide transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#2D4A3E]" />
                <span>Uploading to server...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#2D4A3E]" />
                <span>Choose photo from device</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
            Directly saved to backend server storage. Max 15MB.
          </p>

          {value && (
            <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Image saved in backend storage
            </p>
          )}

          {error && (
            <p className="text-[11px] text-rose-600 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};
