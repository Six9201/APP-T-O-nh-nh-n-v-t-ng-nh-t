
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, imagePreviewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className="relative aspect-square w-full bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-center text-gray-400 hover:border-purple-500 hover:bg-gray-700 transition-all cursor-pointer group"
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imagePreviewUrl ? (
        <img src={imagePreviewUrl} alt={label} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
      ) : (
        <>
          <UploadIcon />
          <span className="text-sm mt-2">{label}</span>
        </>
      )}
       <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${imagePreviewUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
        <span className="text-white font-semibold">Thay đổi ảnh</span>
      </div>
    </div>
  );
};
