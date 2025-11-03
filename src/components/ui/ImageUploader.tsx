// src/components/ui/ImageUploader.tsx
import React, { useRef, useState } from "react";

type Props = {
  onFileSelected: (file: File) => void;
  valueUrl?: string | null;
};

const ImageUploader: React.FC<Props> = ({ onFileSelected, valueUrl }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(valueUrl ?? null);

  const handleSelect = (file?: File | null) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelected(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-3">
        <img
          src={preview ?? "https://via.placeholder.com/100"}
          alt="avatar"
          className="w-24 h-24 object-cover rounded-full border"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-full"
        >
          ✎
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
      />
    </div>
  );
};

export default ImageUploader;
