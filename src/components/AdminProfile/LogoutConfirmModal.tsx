import type { FC } from "react";
import { ModalWrapper } from "./ModalWrapper";

// ---------------- LogoutConfirmModal ----------------
interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: FC<LogoutConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => (
  <ModalWrapper isOpen={isOpen} title="Logout ?.." onClose={onClose} maxW="max-w-xs">
    <p className="text-gray-200 mb-6">Are you sure you want to logout?</p>
    <div className="flex justify-center space-x-4">
      <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
        No
      </button>
      <button onClick={onConfirm} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90">
        Yes
      </button>
    </div>
  </ModalWrapper>
);
