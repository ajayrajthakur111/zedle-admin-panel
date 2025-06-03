// src/components/Complaints/ResolveSuccessModal.tsx
import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface ResolveSuccessModalProps {
  message: string;
  onClose: () => void;
}

/**
 * A transient overlay that auto‐closes after 1.5s.
 */
const ResolveSuccessModal: React.FC<ResolveSuccessModalProps> = ({
  message,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xs w-full p-6 text-center flex flex-col items-center">
        <CheckCircle2 size={48} className="text-green-600 mb-2" />
        <p className="text-md font-medium">{message}</p>
      </div>
    </div>
  );
};

export default ResolveSuccessModal;
