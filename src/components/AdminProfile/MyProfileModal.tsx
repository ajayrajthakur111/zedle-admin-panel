import { useState, type FC } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { useAdminStore, type AdminProfile } from "@/store/adminStore";
import { sendOtp } from "@/api/authService";
import verifiedIcon from "@/assets/profile/verified_profile_icon.svg";
import Edit from "@/assets/profile/edit_address_icon.svg";
import locationIcon from "@/assets/profile/location_icon.svg";



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
      <div className="flex items-center gap-4 mb-6 p-5 ">
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-36 h-36 rounded-full border-2 border-white/50 object-cover"
        />
        <div className="flex flex-col gap-1">
          <h4 className="text-2xl font-bold text-white flex items-center gap-1">
            {name} <img src={verifiedIcon} alt="Verified icon" />
          </h4>
          <p className="text-lg text-[#EAEAEA]">{phoneNumber}</p>
          <p className="text-lg text-[#EAEAEA]">{email}</p>
        </div>
        <div className="ml-auto bg-gradient-to-b from-[#760060] to-[#DC00B3] text-sm  px-5 py-1.5 rounded text-white flex flex-col items-center  w-auto">
          <div>ID</div>
          <div className="font-bold">{empId}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-white/20  mb-6 px-10">
        <button
          onClick={() => setTab("address")}
          className={`flex-1 py-3 px-7 text-sm font-medium transition
            ${
              tab === "address"
                ? "text-white rounded-2xl bg-gradient-to-r from-[#BD2ABF] to-[#591432]  "
                : "text-white/60 hover:text-white"
            }`}
        >
          ADD OR EDIT ADDRESS
        </button>
        <button
          onClick={() => setTab("password")}
          className={`flex-1 py-3 px-7 text-sm font-medium transition
            ${
              tab === "password"
                ? "text-white rounded-2xl bg-gradient-to-r from-[#BD2ABF] to-[#591432]"
                : "text-white/60 hover:text-white"
            }`}
        >
          CHANGE PASSWORD
        </button>
      </div>

      {/* Address Tab */}
      {tab === "address" && (
        <div className="bg-[#45103F30] p-3.5 rounded-3xl shadow-inner">
          <div className="flex justify-between items-center mb-3">
            <p className="text-white text-lg font-medium p-2.5">Current Address</p>
            <button
              onClick={onEditAddress}
              className=""
            >
              <img src={Edit} alt="Edit-address icon" />{" "}
            </button>
          </div>
          <div className="bg-[#38042B26] w-fit p-2 rounded flex flex-col gap-1">
            <p className="text-white text-lg">{currentAddress}</p>
            <p className="text-white text-lg mb-2">
              {region}, {city} - {pin}
            </p>
          </div>
          {isDefaultAddress && (
            <div className="flex items-center gap-2 text-white text-lg my-2 px-2">
              <img src={locationIcon} alt="Location icon" />{" "}
              Default Address
            </div>
          )}
        </div>
      )}

      {/* Password Tab */}
      {tab === "password" && (
        <div className="bg-[#45103F30] p-3.5 rounded-3xl shadow-inner flex flex-col justify-around min-h-[216px]">
          <p className="text-white text-lg font-semibold mb-2">
            Change Password Using Mobile Number
          </p>
          <div className="flex flex-col gap-2">
            <span className="text-white text-lg ">Mobile Number</span>
            <div className="flex items-center justify-start gap-4">
              <input
                type="text"
                value={phoneNumber}
                disabled
                className=" px-4 py-2 rounded-md bg-[#FFFFFF30] h-10 w-[352px] text-white text-sm placeholder-white/60 border-none focus:outline-none"
              />
              <button
                onClick={handleSentOtp}
                className="px-4 py-2.5 text-sm font-semibold rounded-md bg-gradient-to-r from-[#510052] to-[#800A5C] text-white hover:opacity-90"
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
