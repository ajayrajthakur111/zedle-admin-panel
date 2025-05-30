import { useState, type FC } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { Edit2, MapPin, ShieldCheck } from "lucide-react";
import { useAdminStore, type AdminProfile } from "@/store/adminStore";
import { sendOtp } from "@/api/authService";

// ---------------- MyProfileModal ----------------
interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditAddress: () => void;
  onLogout: () => void;
  onGetOtp: () => void;
}

export const MyProfileModal: FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  onEditAddress,
  onLogout,
  onGetOtp,
}) => {
  const [tab, setTab] = useState<"address" | "password">("address");
  const profile = useAdminStore((state) => state.profile);

  // show loading until profile arrives
  if (isOpen && !profile) {
    return (
      <ModalWrapper
        isOpen={isOpen}
        title="My Profile"
        onClose={onClose}
        showLogout
        onLogout={onLogout}
        maxW="max-w-lg"
      >
        <div className="p-6 text-center text-white">Loading profile…</div>
      </ModalWrapper>
    );
  }

  const {
    name,
    phoneNumber,
    email,
    empId,
    currentAddress,
    isDefaultAddress,
    region,
    city,
    pin,
    avatarUrl,
  } = profile as AdminProfile;

  const handleSentOtp = async () => {
    await sendOtp(phoneNumber);
    onGetOtp();
  };
  return (
    <ModalWrapper
      isOpen={isOpen}
      title="My Profile"
      onClose={onClose}
      showLogout
      onLogout={onLogout}
      maxW="max-w-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-20 h-20 rounded-full border-2 border-white/50 object-cover"
        />
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-semibold text-white flex items-center gap-1">
            {name} <ShieldCheck size={18} className="text-green-400" />
          </h4>
          <p className="text-sm text-white/80">{phoneNumber}</p>
          <p className="text-sm text-white/80">{email}</p>
        </div>
        <div className="ml-auto bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] text-xs px-3 py-1 rounded text-white flex flex-col items-center font-bold w-20">
          <div>ID</div>
          <div>{empId}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-white/20 mb-6 px-10">
        <button
          onClick={() => setTab("address")}
          className={`flex-1 py-1 text-sm font-medium transition
            ${
              tab === "address"
                ? "text-white rounded-full bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-secondary)]"
                : "text-white/60 hover:text-white"
            }`}
        >
          ADD OR EDIT ADDRESS
        </button>
        <button
          onClick={() => setTab("password")}
          className={`flex-1 py-1 text-sm font-medium transition
            ${
              tab === "password"
                ? "text-white rounded-full bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-secondary)]"
                : "text-white/60 hover:text-white"
            }`}
        >
          CHANGE PASSWORD
        </button>
      </div>

      {/* Address Tab */}
      {tab === "address" && (
        <div className="bg-[#8e1380] p-4 rounded-lg shadow-inner">
          <div className="flex justify-between items-center mb-3">
            <p className="text-white font-medium">Current Address</p>
            <button
              onClick={onEditAddress}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md"
            >
              <Edit2 size={16} className="text-white" />
            </button>
          </div>
          <div className="bg-[#740c67] w-fit p-2 rounded flex flex-col gap-1">
            <p className="text-white/90">{currentAddress}</p>
            <p className="text-white/90 mb-2">
              {region}, {city} - {pin}
            </p>
          </div>
          {isDefaultAddress && (
            <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
              <MapPin size={16} /> Default Address
            </div>
          )}
        </div>
      )}

      {/* Password Tab */}
      {tab === "password" && (
        <div className="bg-[#8e1380] p-4 rounded-lg shadow-inner flex flex-col justify-around">
          <p className="text-white text-sm font-semibold mb-2">
            Change Password Using Mobile Number
          </p>
          <div className="flex flex-col gap-2">
            <span className="text-white">Mobile Number</span>
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={phoneNumber}
                disabled
                className="flex-grow px-4 py-2 rounded-md bg-white/20 text-white text-sm placeholder-white/60 border-none focus:outline-none"
              />
              <button
                onClick={handleSentOtp}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:opacity-90"
              >
                GET OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};
