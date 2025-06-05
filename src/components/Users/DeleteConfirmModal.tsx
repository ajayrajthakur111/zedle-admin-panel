// src/components/Users/DeleteUserModal.tsx

import React from "react";
import { X } from "lucide-react";

interface DeleteUserModalProps {
  userId: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  userId,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 font-poppins">
      <div className="bg-white rounded-lg w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center bg-white px-5 py-3 border-b border-gray-200 rounded-t-lg">
          <h2 className="text-lg font-semibold text-red-600">Delete User..?</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 text-center space-y-4">
          <p className="text-sm text-gray-700">
            Are you sure want to delete this User..?
          </p>
          <p className="text-sm text-gray-900 font-medium">
            User ID: <span className="text-primary">{userId}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center px-5 pb-5 space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 rounded-md transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-md transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
