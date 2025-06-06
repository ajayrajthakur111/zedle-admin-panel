import type { FC, ReactNode } from "react";
import logoutIcon from '@/assets/profile/logoutIcon.svg'
import crossIcon from '@/assets/cross_icon_light.svg'
import backIcon from '@/assets/back_logo.svg'




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
  className?:string
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
  avatarUrl,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm ">
      <div
        className={`w-full max-w-[600px] px-7 py-4 bg-[linear-gradient(138.57deg,#71035D_16.23%,#D706B1_106.78%)] rounded-xl shadow-2xl overflow-hidden flex flex-col pb-8`}
      >
        <div className="flex items-center justify-between  py-3 border-b border-white/20">
          <div className="flex items-center space-x-2">
        {showBack && onBack && (
          <button
          onClick={onBack}
          >
          <img src={backIcon} alt="back-icon" />
          </button>
        )}
        {avatarUrl && (
          <img
          src={avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full ml-4"
          style={{
        borderImageSource: 'linear-gradient(90deg, #823092 0%, #FFDFFB 100%)',
        borderImageSlice: '1'
          }}
          />
        )}
        {showLogout && onLogout && (
          <button
          onClick={onLogout}
          className=" rounded "
          >
          <img src={logoutIcon} className="text-white" />
          </button>
        )}
          </div>
          <h3 className="text-2xl font-bold text-white truncate ">{title}</h3>
          <button onClick={onClose} className=" rounded text-#FEE2FF ">
          <img src={crossIcon}  alt="cross icon" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};
