// src/components/Complaints/PhoneDetailsModal.tsx
import React from "react";
import { X, Phone } from "lucide-react";
import Button from "@/components/ui/Button";

interface PhoneDetailsModalProps {
  name: string;
  phone: string;
  onClose: () => void;
}

const PhoneDetailsModal: React.FC<PhoneDetailsModalProps> = ({
  name,
  phone,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xs w-full p-6 text-center">
        <Phone size={40} className="text-green-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-1">Contact Details</h3>
        <p className="text-sm">Name: {name}</p>
        <p className="text-sm">Contact Number: {phone}</p>
        <div className="mt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default PhoneDetailsModal;
