// src/components/Users/BlockUserModal.tsx

import React, { useState } from "react";
import { X, AlertTriangle, CheckCircle } from "lucide-react";

interface BlockUserModalProps {
  userId: string;
  onClose: () => void;
  onBlock: (userId: string) => Promise<void>;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  userId,
  onClose,
  onBlock,
}) => {
  // Tracks whether the user has just been blocked
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    setLoading(true);
    try {
      await onBlock(userId);
      setIsSuccess(true);
    } catch (err) {
      console.error("Error blocking user:", err);
      // Optionally display an error toast here.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 font-poppins">
      <div className="bg-white rounded-lg w-full max-w-xs shadow-xl">
        {/* Header */}
        <div className="flex justify-center items-center bg-white px-5 py-3 border-b border-gray-200 rounded-t-lg relative">
          <h2 className="text-lg font-semibold text-red-600">
            Acceptable User Policy Violation
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 text-center space-y-4">
          {/* Icon: warning or success */}
          {!isSuccess ? (
            <AlertTriangle size={48} className="text-red-500 mx-auto" />
          ) : (
            <CheckCircle size={48} className="text-green-600 mx-auto" />
          )}

          {/* Text */}
          {!isSuccess ? (
            <p className="text-sm text-gray-700">
              You are about to block this user.
            </p>
          ) : (
            <p className="text-sm text-green-700 font-medium">
              User Blocked successfully
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex justify-center">
          {!isSuccess ? (
            <button
              onClick={handleBlock}
              disabled={loading}
              className={`w-full ${
                loading ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
              } text-white font-medium py-2 rounded-md transition`}
            >
              {loading ? "Blocking..." : "Block this User"}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;
