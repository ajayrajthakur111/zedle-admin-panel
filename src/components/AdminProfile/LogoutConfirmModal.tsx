import type { FC } from "react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: FC<LogoutConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // This is the modal content itself.
    // To make it a typical popup, you'd wrap this in a full-screen div with a backdrop
    // (e.g., fixed position, z-index, background overlay, flex centering).
    // For this example, it's styled as the standalone white box from your Figma.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm ">
      
    <div 
      className="font-['Inter'] bg-white rounded-[20px] p-6 shadow-xl w-full max-w-xs" 
      // Add mx-auto if you want to center it horizontally in a full-width parent.
      // For a true modal, centering is usually handled by the backdrop container.
    >
      <h2 className="text-[28px] font-bold text-primary leading-tight">
        Logout ?..
      </h2>

      <hr className="mt-3 mb-5 border-t-3 border-[#E4E4E4]" />

      <p className="text-xl text-center text-[#333333]"> {/* Default line-height for text-xl is good */}
        Are your sure want to Logout.?
      </p>

      <div className="mt-8 flex justify-center gap-3 w-full">
        <button
          onClick={onClose}
          className="px-14 py-2 bg-[#A7A7A7] text-white text-lg font-semibold rounded-lg hover:bg-[#929292] active:bg-[#7E7E7E] transition-colors duration-150 ease-in-out text-center"
          >
          No
        </button>
        <button
          onClick={onConfirm}
          className="px-14 py-2 text-white text-lg font-semibold rounded-lg transition-all duration-150 ease-in-out text-center shadow-[0_5px_10px_rgba(99,0,82,0.35)] hover:opacity-90 active:opacity-80"
          style={{
            background: 'linear-gradient(96.82deg, #630052 5.34%, #C901A5 132.42%)',
          }}
          >
          Yes
        </button>
      </div>
    </div>
          </div>
  );
};