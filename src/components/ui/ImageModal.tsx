// src/components/ui/ImageModal.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        {/* Body: Display the image */}
        <div className="p-4 flex justify-center">
          <img
            src={imageUrl}
            alt="Product"
            className="max-h-[70vh] object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
