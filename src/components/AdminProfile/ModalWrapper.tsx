import { X, ChevronLeft, LogOut } from "lucide-react";
import type { FC, ReactNode } from "react";

// ---------------- ModalWrapper ----------------
interface ModalWrapperProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  showBack?: boolean;
  onBack?: () => void;
  showLogout?: boolean;
  onLogout?: () => void;
  maxW?: string;
  avatarUrl?: string;
}

export const ModalWrapper: FC<ModalWrapperProps> = ({
  isOpen,
  title,
  children,
  onClose,
  showBack = false,
  onBack,
  showLogout = false,
  onLogout,
  maxW = "max-w-md",
  avatarUrl,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`w-full ${maxW} bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl shadow-2xl overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
          <div className="flex items-center space-x-2">
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded hover:bg-white/10"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-white/40"
              />
            )}
            {showLogout && onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded hover:bg-white/10"
              >
                <LogOut size={20} className="text-white" />
              </button>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10">
        <X size={20} className="text-white" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};
